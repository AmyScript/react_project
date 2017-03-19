import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';

export default class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: '',
			userId:''
		};
		this.formToShow = this.formToShow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({
				userId: user.uid
			})
		})
	}
	formToShow(e) {
		e.preventDefault();
		this.setState({
			formToShow: e.target.className
		})
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	signup(e) {
		e.preventDefault();
		console.log('signing up');
		console.log(this.state.email, this.state.password, this.state.confirm);
		if(this.state.password === this.state.confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((userData) => {
					console.log(userData);
				});
			this.setState({
				formToShow: ''
			})
		} else {

		}

	}
	login(e) {
		e.preventDefault();
		firebase.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((userData) => {
				console.log(userData.uid);
			})
			this.setState({
				formToShow: ''
			})
	}
	signOut() {
		firebase.auth().signOut();
		localStorage.setItem("jobs_search", '');
		localStorage.setItem("jobs_location", '');
		this.setState({
			userId: ''
		})

	}
	render() {
		let loginClassName = "login";
		let signUpClassName = "signup";
		let signOutClassName = "signout";
		let favClassName =" ";
		if (this.state.userId) {
			loginClassName += " invisible";
			signUpClassName += " invisible";
		} else {
			signOutClassName +=" invisible";
			favClassName +="invisible";
		}
		let loginForm = '';
		if(this.state.formToShow === 'signup') {
			loginForm = (
				<form onSubmit={this.signup} className="user-form">
					<div>
						<input type="email" name="email" placeholder="Email" onChange={this.handleChange} />
					</div>
					<div>
						<input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
					</div>
					<div>
						<input type="password" name="confirm" placeholder="Confirm Password" onChange={this.handleChange} />
					</div>
					<div>
						<button>Sign In</button>
					</div>
				</form>
			);
		}
		else if(this.state.formToShow === "login") {
			loginForm = (
				<form onSubmit={this.login} className="user-form">
					<div>
						<input type="email" name="email" placeholder="Email" onChange={this.handleChange}/>
					</div>
					<div>
						<input type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
					</div>
					<div>
						<button>Log In</button>
					</div>
				</form>
			);
		}
		return(
			<div>
				<header>
					<h1>Dream Job</h1>
					<nav>
						<ul>
							<li><Link activeClassName='active' to={`/`} onlyActiveOnIndex={true} activeStyle={{color:'#6484aa'}}>Job Search</Link></li>
							<li className={favClassName}><Link activeClassName='active' className={favClassName} to={`/favs`} onlyActiveOnIndex={true} activeStyle={{color:'#6484aa'}}>My Favourites</Link></li>
							<li className={signUpClassName}><a href="" className={signUpClassName} onClick={this.formToShow}>Sign Up</a></li>
							<li className={loginClassName}><a href="" className={loginClassName} onClick={this.formToShow}>Log In</a></li>
							<li className={signOutClassName}><a href="" className={signOutClassName} onClick={this.signOut}>Sign Out</a></li>
							<li><a href="https://twitter.com/share?url=http%3A%2F%2Famyscript.com%2Fjobs&text=Find%20your%20dream%20job!" className="twitter-share-button" ><i className="fa fa-twitter-square"  aria-hidden="true"></i></a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></li>
						</ul>
					</nav>
				</header>
				{loginForm}
			</div>
		)
	}
}
