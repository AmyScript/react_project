import React from 'react';
import ReactDOM from 'react-dom';
import { ajax, when } from 'jquery';
import Job from './jobs.js';
import Header from './header.js'
import MyFavs from './myfavs.js';
import CompanyDetails from './companydetails.js'
import Footer from './footer.js'
import { Router, Route, browserHistory, Link } from 'react-router';

const indeedApiKey = '615485832038992';
const indeedApiUrl = 'http://api.indeed.com/ads/apisearch'
let userId = '';
//gets a maximum of 125 results for each job search
let ajaxIndexArray = [0,25,50,75,100];



// Initialize Firebase
var config = {
    apiKey: "AIzaSyCrDj86WxoajkbhJOmJv-i3vR2W2xc8YdU",
    authDomain: "jobsearch-e2b46.firebaseapp.com",
    databaseURL: "https://jobsearch-e2b46.firebaseio.com",
    storageBucket: "jobsearch-e2b46.appspot.com",
    messagingSenderId: "213109786782"
};
firebase.initializeApp(config);

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			jobs: [],
			companies: {},
			jobType: "",
			jobLocation:"",
			favJob: {},
			scrollPosition: localStorage.getItem("ScrollPosition")
		}
		this.handleChange = this.handleChange.bind(this);
		this.getJobs = this.getJobs.bind(this);
		this.save = this.save.bind(this);
	
	}
	
	
	getJobs(startPage, jobType, jobLocation) {
			return ajax({
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
	                    start: startPage,
	                    limit: 25,
	                    fromage: 30,
	                    filter: 0,
	                    latlong: 1,
	                    co: 'ca'
	                }
	            }
			})
		
	}
	getJobsIteration(e,job, location) {
		e.preventDefault();
		const dataArray = [];
		if (job !=="" && location !=="") {
			localStorage.setItem("jobs_search", job);
			localStorage.setItem("jobs_location", location);
			for (let i=0; i < ajaxIndexArray.length; i++) {
				let startPage = ajaxIndexArray[i];
				dataArray.push(this.getJobs(startPage, job, location));
			}
			Promise.all(dataArray)
			.then(res => {
				let jobsArray=[];
				jobsArray = res.map((item) => {
					return item.results;
				})
				
				jobsArray = _.flatten(jobsArray);
				this.setState({
						jobs: jobsArray
				})

			})
		}
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	save(company, jobTitle, url, snippet, city, starred, key) {
		//if userID is present
		//push favourites into userID folder
		//display favourites based on userID folder
		//if userID is not present
		//do not allow favourites

		firebase.auth().onAuthStateChanged((user) => {
			if(user) {
				let userId = user.uid;
				if (starred === true) {
					const dbRef = firebase.database().ref(userId + '/' + key);
					dbRef.remove();
				} else {
					const dbRef = firebase.database().ref(userId + '/' + key).set({
						company: company,
						job: jobTitle,
						url: url,
						city: city,
						snippet: snippet
					});
				}
			}
		})
		
	}

	render() {
		let searchSectionClassName = "searchSection";
		if (this.state.jobs.length === 0) {
			searchSectionClassName += " full";
		}
		return(
			<div className="container" id="home">
				<Header />
				<section className={searchSectionClassName}>
					<form className="searchJobs" onSubmit={(e) => this.getJobsIteration(e,this.state.jobType, this.state.jobLocation)}>
						<h4>Job:</h4><input type="text" name="jobType" onChange={this.handleChange} value={this.state.jobType} />
						<h4>Location:</h4><input type="text" name="jobLocation" onChange={this.handleChange} value={this.state.jobLocation} /><button><h5>Search</h5></button>
					</form>
				</section>
				<section className="content">
					<div className="jobs">
					{this.state.jobs.map((job, i) => {
						return(
							//doesn't have to be called data, can be called anything, can have multiple props
							<Job data={job} save={this.save} key={i} />
						)
					})}
					</div>
				</section>
				<Footer />
			</div>
		)
	}
	componentDidMount() {
		if(localStorage.getItem("jobs_search") && localStorage.getItem("jobs_location")) {
			const event = {
				preventDefault() {}
			}
			this.getJobsIteration(event, localStorage.getItem('jobs_search'), localStorage.getItem('jobs_location'));
		}
		
	}

}

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path='/' component={App} />
		<Route path='/company/:company_name' component={CompanyDetails} />
		<Route path='/favs' component={MyFavs} />
	</Router>, document.getElementById('app'));