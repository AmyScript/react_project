import React from 'react';

export default (props) => {

	return(
		<div className="reviewItem">
			<div className="title">
				<h2>{props.data.name}</h2>
				<img src={props.data.squareLogo} />
				<div>
					<a href={`http://${props.data.website}`} target="newwindow">{props.data.website}</a>
				</div>
				<h5>Industry: {props.data.industry}</h5>
			</div>
			<div>
				<h5 className="blue">Ratings by {props.data.numberOfRatings} Users:</h5>
				<p>Compensation and Benefits: {props.data.compensationAndBenefitsRating}</p>
				<p>Culture and Value: {props.data.cultureAndValuesRating}</p>
				<p>Work Life Balance: {props.data.workLifeBalanceRating}</p>
				<p>Senior Leadership: {props.data.seniorLeadershipRating}</p>
				<h5>Overall: {props.data.overallRating} </h5>
			</div>
			{props.data.featuredReview !== undefined ? 
				<div> 
					
					<h5 className="blue">Feature Review from {props.data.featuredReview.jobTitle}</h5>
					<h5>Pros:</h5>
					<p>"{props.data.featuredReview.pros}"</p>
					<h5>Cons:</h5>
					<p>"{props.data.featuredReview.cons}"</p>
					<p>Reviewed done on {props.data.featuredReview.reviewDateTime}</p>
					<button><a href={`${props.data.featuredReview.attributionURL}`} target="newwindow">More Reviews</a></button>
				</div>
			: null } 
		</div>
	)
}