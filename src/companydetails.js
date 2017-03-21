import React from 'react';
import { ajax, when } from 'jquery';
import { Link } from 'react-router';
import Review from './review.js';
import Header from './header.js'
import Footer from './footer.js'
const glassdoorApiId = '131464';
const glassdoorApiKey = 'bWbLVsTAXzS';
const glassdoorApiUrl = 'http://api.glassdoor.com/api/api.htm?t.p=131464&t.k=bWbLVsTAXzS';

export default class CompanyDetails extends React.Component {
	constructor() {
		super();
		this.state = {
			companies: {}
		}
	}
	render() {
		return(
			<div className="container">
				<Header />
				<section>
					<div className="review">
						<Review data={this.state.companies} />
					</div>
				</section>
				<Footer />
			</div>
		)
	}
	componentDidMount() {
		const companies = ajax({
			url: glassdoorApiUrl,
            dataType: 'jsonp',
            method:'GET',
            data: {
            	userip:'0.0.0.0',
            	useragent:'abc',
            	format: 'json',
            	v:1,
            	action: 'employers',
            	q: this.props.params.company_name
                }
            
		})
		when(companies).done((result) => {
				if(result.response.employers.length !== 0) {
				
				this.setState({
					companies: result.response.employers[0]
				})
			} else {
				this.setState({
					companies: {
						name: "Sorry company not found"
					}
				})
			}
		});
	}

}