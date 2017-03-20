import React from 'react';
import { Link } from 'react-router';


export default class Job extends React.Component {
		constructor() {
			super();
			this.state = {
				starred: false,
				userId: ''
			}
			this.clickHandler = this.clickHandler.bind(this)
		}
		componentDidMount() {
			//get database array
			//go through keys in the database
			//if one of the keys in the database is equal to this.props.data.jobkey set starred to true
			firebase.auth().onAuthStateChanged((user) => {
				if(user) {
					this.setState({
						userId: user.uid
					})
					const dbRef = firebase.database().ref(this.state.userId);
					dbRef.on('value', (data) => {
						const dataBaseData = data.val();
						const itemArray = [];
						for(let itemKey in dataBaseData) {
							if (itemKey === this.props.data.jobkey) {
								this.setState({
									starred:true
								})
							}
						}
					});
				}
			})
		}
		clickHandler() {
			this.setState({
				starred: !this.state.starred
			})
			this.props.save(this.props.data.company, this.props.data.jobtitle, this.props.data.url, this.props.data.snippet, this.props.data.city, this.state.starred, this.props.data.jobkey);
		}
		render() {
			let starClassNames = "fa fa-star";
			if (this.state.starred === true) {
				starClassNames += " redstar";
			} 
			if (!this.state.userId) {
				starClassNames += " invisible";
			}
			return(
				<div className="jobItem">
					<h4>{this.props.data.jobtitle}</h4>
					<i className={starClassNames} onClick={() => this.clickHandler()} aria-hidden="true"></i>
					<h5>{this.props.data.company}</h5>
					<Link to={`/company/${this.props.data.company}`}><button>Check Company</button></Link>
					<p>{this.props.data.city}</p>
					<p dangerouslySetInnerHTML={{__html: this.props.data.snippet}}></p>
					<a href={this.props.data.url} target="newwindow"><div className="apply">Apply</div></a>
				</div>
			)
		}
}

