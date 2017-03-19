import React from 'react';
import Header from './header.js'
import Footer from './footer.js'
import { Link } from 'react-router';
let userId='';

export default class MyFavs extends React.Component {
	constructor(){
		super();
		this.state = {
			favJobs: []
		}
	}
	remove(key) {
		const dbRef = firebase.database().ref(userId + '/' + key);
		dbRef.remove();
	}
	render() {
		return(
			<div className="container">
				<Header />
				<section className="favJobs">
				{this.state.favJobs.map((job, i) => {
					return(
						<div className="jobItem" key={job.key}>
							<h4>{job.job}</h4> 
							<i className="fa fa-times" onClick={() => this.remove(job.key)} aria-hidden="true"></i>
							<h5>{job.company}</h5>
							<Link to={`/company/${job.company}`}><button>Check Company</button></Link> 
							<p>{job.city}</p>
							<p dangerouslySetInnerHTML={{__html: job.snippet}}></p>
							<a href={job.url} target="newwindow"><div className="apply">Apply</div></a>
						</div>
					)
				})}
				</section>
				<Footer />
			</div>
		)
	}
	componentDidMount() {
		

		firebase.auth().onAuthStateChanged((user) => {
			if(user) {	userId = user.uid;
						const dbRef = firebase.database().ref(userId);
						dbRef.on('value', (data) => {
						console.log(data.val());
						const dataBaseData = data.val();
						const itemArray = [];
						window.x = user.uid;
						console.log(window.x);
						for(let itemKey in dataBaseData) {
							const fooKey = dataBaseData[itemKey];
							console.log(itemKey);
							fooKey.key = itemKey;
							itemArray.push(fooKey);
						}
						this.setState({
							favJobs: itemArray
						})
					});
			}
		})
	}
}
