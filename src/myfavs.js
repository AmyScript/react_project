import React from 'react';
import Header from './header.js'
import Footer from './footer.js'
import { Link } from 'react-router';
import Fav from './fav.js';
let userId='';

export default class MyFavs extends React.Component {
	constructor(){
		super();
		this.state = {
			favJobs: [],
			
			name:''
		}
	}
	
	render() {
		
		return(
			<div className="container">
				<Header />
				<section className="favJobs">
				{this.state.favJobs.map((job, i) => {
					return(
						<Fav data={job} />
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
