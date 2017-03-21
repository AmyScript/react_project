import React from 'react';
import { Link } from 'react-router';
let userId='';

export default class Fav extends React.Component {
	constructor() {
		super();
		this.state = {
			showNote: false,
			savedNote:'',
			textBox:''
			
		}
		this.handleChange = this.handleChange.bind(this);
		this.saveNote = this.saveNote.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.remove = this.remove.bind(this);
		this.getDatabaseNote = this.getDatabaseNote.bind(this);
	}
	remove(key) {
		const dbRef = firebase.database().ref(userId + '/' + key);
		dbRef.remove();
		this.getDatabaseNote();
	}
	showNote(key) {
		this.setState({
			showNote: !this.state.showNote
		})
	}
	handleChange(e) {
		
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	saveNote(e, key) {
		e.preventDefault();
		let user = firebase.auth().currentUser;
			if(user) {
				let userId = user.uid;
				let dbRef = firebase.database().ref(userId + '/' + key).update({
					note: this.state.savedNote
				});
				dbRef = firebase.database().ref(userId + '/' + key);
				dbRef.on('value', (data) => {
					const dataBaseData = data.val();
					this.setState({
						showNote: false,
						savedNote: dataBaseData.note
					})
				})
			}
	}
	render() {
		let notes ='';
		if (this.state.showNote && this.state.savedNote ===''){
			notes = (
				<form>
				<textarea type="text" name="savedNote" onChange={this.handleChange}></textarea>
				<button type="submit" onClick={(e) => this.saveNote(e,this.props.data.key)}>Save</button>
				</form>
			);
		} else if (!this.state.showNote && this.state.savedNote !==undefined && this.state.savedNote !=='') {
			notes = (
				<div>
					<h5>Notes:</h5>
					<p> {this.state.savedNote}</p>
				</div>

			)
		} else if (this.state.showNote && this.state.savedNote !=='') {
			notes = (
				<form>
				<textarea type="text" name="savedNote" onChange={this.handleChange} value={this.state.savedNote} ></textarea>
				<button type="submit" onClick={(e) => this.saveNote(e,this.props.data.key)}>Save</button>
				</form>

			)
		}
		return(
			<div className="jobItem" key={this.props.data.key}>
				<h4>{this.props.data.job}</h4> 
				<i className="fa fa-times" onClick={() => this.remove(this.props.data.key)} aria-hidden="true"></i>
				<i className="fa fa-pencil-square-o" onClick={() => this.showNote(this.props.data.key)} aria-hidden="true"></i>
				<h5>{this.props.data.company}</h5>
				<Link to={`/company/${this.props.data.company}`}><button>Check Company</button></Link> 
				<p>{this.props.data.city}</p>
				<p dangerouslySetInnerHTML={{__html: this.props.data.snippet}}></p>
				<div>
					{notes}
				</div> 
				<a href={this.props.data.url} target="newwindow"><div className="apply">Apply</div></a>
			</div>


		)
	}
	getDatabaseNote() {
			this.setState({
				savedNote:''
			})
			let user = firebase.auth().currentUser;
				if(user) {	
					userId = user.uid;
					let key = this.props.data.key
					let dbRef = firebase.database().ref(userId + '/' + key);
					dbRef.on('value', (data) => {
						const dataBaseData = data.val();
						this.setState({
							savedNote: dataBaseData.note
						})
		
					})			
				}
	}
	componentDidMount() {
		this.getDatabaseNote();
	}

}