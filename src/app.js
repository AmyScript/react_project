import React from 'react';
import ReactDOM from 'react-dom';
import { ajax, when } from 'jquery';
import Job from './jobs.js';
import Review from './review.js';
import { Router, Route, browserHistory, Link } from 'react-router';

const indeedApiKey = '615485832038992';
const indeedApiUrl = 'http://api.indeed.com/ads/apisearch'
const glassdoorApiId = '131464';
const glassdoorApiKey = 'bWbLVsTAXzS';
const glassdoorApiUrl = 'http://api.glassdoor.com/api/api.htm?t.p=131464&t.k=bWbLVsTAXzS';




class CompanyDetails extends React.Component {
	constructor() {
		super();
		this.state = {
			companies: {}
		}
	}
	render() {
		return(
			<div>
			<header>
				<Link to={`/`}>Back to Job Search Results</Link>
			</header>
			<div className="review">
				<Review data={this.state.companies} />
			</div>
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
				document.getElementsByClassName('review')[0].style.visibility = 'visible';
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

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			jobs: [],
			companies: {},
			jobType: "",
			jobLocation:""
		}
		this.checkCompany = this.checkCompany.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getJobs = this.getJobs.bind(this);
	}

	getJobs(e, jobType, jobLocation) {
		console.log(jobType);
		e.preventDefault();
		if (jobType !=="" && jobLocation !=="") {
			localStorage.setItem("jobs_search", jobType);
			localStorage.setItem("jobs_location", jobLocation);
			const allJobs = ajax({
				url: 'http://proxy.hackeryou.com',
	            dataType: 'json',
	            method:'GET',
	            data: {
	                reqUrl: indeedApiUrl,
	                params: {
	                    publisher: indeedApiKey,
	                    v: 2,
	                    format: 'json',
	                    q: jobType,
	                    l: jobLocation,
	                    sort: 'date',
	                    radius: 25,
	                    start: 0,
	                    limit: 25,
	                    fromage: 30,
	                    filter: 0,
	                    latlong: 1,
	                    co: 'ca'
	                }
	            }
			})
			when(allJobs).done((res) => {
				console.log(res);
				this.setState({
					jobs: res.results
				})
			const allJobs2 = ajax({
				url: 'http://proxy.hackeryou.com',
	            dataType: 'json',
	            method:'GET',
	            data: {
	                reqUrl: indeedApiUrl,
	                params: {
	                    publisher: indeedApiKey,
	                    v: 2,
	                    format: 'json',
	                    q: jobType,
	                    l: jobLocation,
	                    sort: 'date',
	                    radius: 25,
	                    start: 25,
	                    limit: 25,
	                    fromage: 15,
	                    filter: 0,
	                    latlong: 1,
	                    co: 'ca'
	                }
	            }
			})
			when(allJobs2).done((res2 => {
				let jobsArray2 = res2.results;
				let jobsArray = this.state.jobs;
				for (let key in jobsArray2) {
					const job = jobsArray2[key];
					jobsArray.push(job);
				}
				this.setState({
					jobs: jobsArray
				})
				console.log(this.state.jobs);
			}))
			});
		}
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	render() {
		return(
			<div>
				<header>
				<h1>Search for Jobs in Canada</h1>
				<form onSubmit={(e) => this.getJobs(e,this.state.jobType, this.state.jobLocation)}>
					Job:<input type="text" name="jobType" onChange={this.handleChange} value={this.state.jobType} />Location:<input type="text" name="jobLocation" onChange={this.handleChange} value={this.state.jobLocation} /><button>Search</button>
				</form>
				</header>
				<section className="content">
					<div className="jobs">
					{this.state.jobs.map((job, i) => {
						return(
							//doesn't have to be called data, can be called anything, can have multiple props
							<Job data={job} checkCompany={this.checkCompany} key={i} />
						)
					})}
					</div>
					<div className="review">
						<Review data={this.state.companies} />
					</div>

				</section>
			</div>
		)
	}
	componentDidMount() {
		//don't need a dollar sign because we deconstructed it in the import to only bring in Ajax
		document.getElementsByClassName('review')[0].style.visibility = 'hidden';
		if(localStorage.getItem("jobs_search") && localStorage.getItem("jobs_location")) {
			const event = {
				preventDefault() {}
			}
			this.getJobs(event, localStorage.getItem('jobs_search'), localStorage.getItem('jobs_location'));
		}
	}

	checkCompany(company) {
		console.log(company);
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
            	q: company
                }
            
		})
		when(companies).done((result) => {
			console.log(result, this);
				if(result.response.employers.length !== 0) {
				document.getElementsByClassName('review')[0].style.visibility = 'visible';
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

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path='/' component={App} />
		<Route path='/company/:company_name' component={CompanyDetails} />
	</Router>, document.getElementById('app'));