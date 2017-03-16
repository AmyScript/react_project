import React from 'react';

export default (props) => {
	return(
		<div>
			<h1>{props.data.name}</h1><img src={props.data.squareLogo} />
			<a href={`http://${props.data.website}`} target="newwindow">{props.data.website}</a>
			<h3>Industry: {props.data.industry}</h3>
			<h3>Ratings by {props.data.numberOfRatings} Users:</h3>
			<p>Compensation and Benefits: {props.data.compensationAndBenefitsRating}</p>
			<p>Culture and Value: {props.data.cultureAndValuesRating}</p>
			<p>Work Life Balance: {props.data.workLifeBalanceRating}</p>
			<p>Senior Leadership: {props.data.seniorLeadershipRating}</p>
			<h3>Overall: {props.data.overallRating} </h3>
		</div>
	)
}