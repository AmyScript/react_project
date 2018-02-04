import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';
let errorCode='';
let loginForm = '';
class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			formToShow: '',
			email: '',
			password: '',
			confirm: '',
			userId:'',
			errorMsg:'',
			toggleMenu:false
		};
		this.formToShow = this.formToShow.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		this.signOut = this.signOut.bind(this);
		this.close = this.close.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					userId: user.uid
				})
			}
		})
	}
	toggleMenu() {
		this.setState({
			toggleMenu : !this.state.toggleMenu,
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
		if(this.state.password === this.state.confirm) {
			firebase.auth()
				.createUserWithEmailAndPassword(this.state.email, this.state.password)
				.then((userData) => {
					this.setState({
						formToShow: ''
					})
				})
				.catch((error) => {
					errorCode = error.code;
					let errorMessage = error.message;
					if (errorCode) {
						this.setState({
							errorMsg: errorMessage
						})
					}
				});
			
		} else {
			this.setState({
				errorMsg: "Passwords do not match."
			})
		}

	}
	login(e) {
		e.preventDefault();
		firebase.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then((userData) => {
				this.setState({
					formToShow: ''
				})
			})
			.catch((error) => {
				errorCode = error.code;
				let errorMessage = error.message;
				if (errorCode) {
					this.setState({
						errorMsg: errorMessage
					})
				}
			});
			
	}
	signOut(e) {
		e.preventDefault();
		sessionStorage.setItem("jobs_search", '');
		sessionStorage.setItem("jobs_location", '');
		
		this.setState({
			userId: ''
		})
		firebase.auth().signOut();
		this.context.router.push('/');
		window.location.reload(true);
		

	}
	close(e) {
		e.preventDefault();
		this.setState ({
			formToShow: ''
		})
	}
	render() {
		loginForm = '';

		let loginClassName = "login";
		let signUpClassName = "signup";
		let signOutClassName = "signout";
		let toggleMenuName = "animated-icon1";
		let favClassName =" ";
		if (this.state.userId) {
			loginClassName += " invisible";
			signUpClassName += " invisible";
		} else {
			signOutClassName +=" invisible";
			favClassName +="invisible";
		}
		let mobilemenu = (
			<nav>
				<ul>
					<li><Link activeClassName='active' to={`/`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>Job Search</Link></li>
					<li className={favClassName}><Link activeClassName='active' className={favClassName} to={`/favs`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>My Favourites</Link></li>
					<li className={signUpClassName}><a href="" className={signUpClassName} onClick={this.formToShow}>Sign Up</a></li>
					<li className={loginClassName}><a href="" className={loginClassName} onClick={this.formToShow}>Log In</a></li>
					<li className={signOutClassName}><a href="" className={signOutClassName} onClick={this.signOut}>Sign Out</a></li>
					<li><a href="https://twitter.com/share?url=https%3A%2F%2Fjobsearch-e2b46.firebaseapp.com&text=Find%20your%20dream%20job!" className="twitter-share-button"  target="newwindow"><i className="fa fa-twitter-square"  aria-hidden="true"></i></a><script async src="//platform.twitter.com/widgets.js" charSet="utf-8"></script></li>
				</ul>
			</nav>
		);
		if (this.state.toggleMenu) {
			toggleMenuName += " open";
			mobilemenu = (
				<nav className="open">
					<ul>
						<li><Link activeClassName='active' to={`/`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>Job Search</Link></li>
						<li className={favClassName}><Link activeClassName='active' className={favClassName} to={`/favs`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>My Favourites</Link></li>
						<li className={signUpClassName}><a href="" className={signUpClassName} onClick={this.formToShow}>Sign Up</a></li>
						<li className={loginClassName}><a href="" className={loginClassName} onClick={this.formToShow}>Log In</a></li>
						<li className={signOutClassName}><a href="" className={signOutClassName} onClick={this.signOut}>Sign Out</a></li>
						<li><a href="https://twitter.com/share?url=https%3A%2F%2Fjobsearch-e2b46.firebaseapp.com&text=Find%20your%20dream%20job!" className="twitter-share-button"  target="newwindow"><i className="fa fa-twitter-square"  aria-hidden="true"></i></a><script async src="//platform.twitter.com/widgets.js" charSet="utf-8"></script></li>
					</ul>
				</nav>
			);
		}
		
		if(this.state.formToShow === 'signup') {
			loginForm = (
				<form onSubmit={this.signup} className="user-form">
					<i className="fa fa-times closeForm" aria-hidden="true" onClick={this.close}></i>
					<p>Welcome to Dream Job!</p>
					<i className="fa fa-user-plus" aria-hidden="true"></i>
					<p> Create Your Account </p>
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
					<div className="error">
						<p className="errorMessage"> {this.state.errorMsg} </p>
					</div>
				</form>
			);
		}
		else if(this.state.formToShow === "login") {
			loginForm = (
				<form onSubmit={this.login} className="user-form">
					<i className="fa fa-times closeForm" aria-hidden="true" onClick={this.close}></i>
					<p>Welcome back to Dream Job!</p>
					<i className="fa fa-user-circle-o" aria-hidden="true"></i>
					<p> Sign In to your account</p>
					<div>
						<input type="email" name="email" placeholder="Email" onChange={this.handleChange}/>
					</div>
					<div>
						<input type="password" name="password" placeholder="Password" onChange={this.handleChange}/>
					</div>
					<div>
						<button>Log In</button>
					</div>
					<div className="error">
						<p className="errorMessage"> {this.state.errorMsg} </p>
					</div>
				</form>
			);
		}
		return(
			<div>
				<div className="desktop">
					<header>
						<div>
							<h1 className="logo"><Link to={`/`}>Dream Job</Link></h1><img src="../dreamJob.png" />
						</div>
						<nav>
							<ul>
								<li><Link activeClassName='active' to={`/`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>Job Search</Link></li>
								<li className={favClassName}><Link activeClassName='active' className={favClassName} to={`/favs`} onlyActiveOnIndex={true} activeStyle={{color:'#5484BC'}}>My Favourites</Link></li>
								<li className={signUpClassName}><a href="" className={signUpClassName} onClick={this.formToShow}>Sign Up</a></li>
								<li className={loginClassName}><a href="" className={loginClassName} onClick={this.formToShow}>Log In</a></li>
								<li className={signOutClassName}><a href="" className={signOutClassName} onClick={this.signOut}>Sign Out</a></li>
								<li><a href="https://twitter.com/share?url=https%3A%2F%2Fjobsearch-e2b46.firebaseapp.com&text=Find%20your%20dream%20job!" className="twitter-share-button"  target="newwindow"><i className="fa fa-twitter-square"  aria-hidden="true"></i></a><script async src="//platform.twitter.com/widgets.js" charSet="utf-8"></script></li>
							</ul>
						</nav>
					</header>
					{loginForm}
				</div>
				<div className="mobile">
					<header>
						<div className="mobileBrand">
							<h1 className="logo"><Link to={`/`}>Dream Job</Link></h1><img src="../dreamJob.png" />
						</div>
						<div className={toggleMenuName} onClick={this.toggleMenu}><span></span><span></span><span></span></div>
						
					</header>
					{mobilemenu}
					{loginForm}
				</div>
			</div>
		)
	}
}

Header.contextTypes = {
	router: React.PropTypes.object
}


export default Header;