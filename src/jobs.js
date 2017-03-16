import React from 'react';
import { Link } from 'react-router';

export default (props) => {
		return(
			<div>
				<h3>{props.data.jobtitle}</h3>
				<p>{props.data.company}<button onClick={() => props.checkCompany(props.data.company)}>Check Company</button></p><Link to={`/company/${props.data.company}`}>TO company</Link>
				<p dangerouslySetInnerHTML={{__html: props.data.snippet}}></p>
				<a href={props.data.url} target="newwindow">Link</a>
			</div>
		)
}

