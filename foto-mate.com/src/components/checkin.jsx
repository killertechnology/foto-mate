import React, { Component } from 'react';



class Checkin extends Component {
	render() {
				return(

					<div id="myCarousel" className="carousel slide" data-ride="carousel" data-keyboard="true" data-pause="hover" data-interval="7000">
				      <ol className="carousel-indicators">
				        <li data-toggle="tooltip" data-title="Download Native JavaScript for Bootstrap" data-target="#myCarousel" data-slide-to="0" className="active"></li>
				        <li data-toggle="tooltip" data-title="Getting started with Native JavaScript" data-target="#myCarousel" data-slide-to="1"></li>
				        <li data-toggle="tooltip" data-title="HTML5 inside" data-target="#myCarousel" data-slide-to="2"></li>
				        <li data-toggle="tooltip" data-title="Why BSN?" data-target="#myCarousel" data-slide-to="3"></li>
				        <li data-toggle="tooltip" data-title="Scroll To Carousel" data-target="#myCarousel" data-slide-to="4"></li>
				      </ol>
				      <div className="carousel-inner">
				        <div className="item active">
				          <div className="item-bg bg-primary"></div>
				          <div className="container">
				            <div className="carousel-caption slide">
				              <h2>A better way to Bootstrap</h2>
				              <p>The jQuery plugins for Bootstrap 3 redeveloped with native JavaScript, providing same basic functionality, but lighter in size and delivering higher performance for your application.</p>
				              <p><a className="btn btn-lg btn-default btn-empty" href="https://github.com/thednp/bootstrap.native/archive/master.zip">Download</a> <a className="btn btn-lg btn-info" href="https://github.com/thednp/bootstrap.native/wiki" target="_blank" role="button">Wiki</a></p>
				            </div>
				          </div>
				        </div>
				        <div className="item">
				          <div className="item-bg bg-pink"></div>
				          <div className="container">
				            <div className="carousel-caption">
				              <h2>New to native JavaScript?</h2>
				              <p>Have no worry, the internet is full of scripts and tutorials, <a href="http://vanilla-js.com/" target="_blank">native JavaScript</a> is the coolest programing language ever! Far more powerful and 
				                requires almost <b>zero</b> maintenance on very long periods of time.</p>
				              <p><a className="btn btn-lg btn-default btn-empty" href="http://blog.garstasio.com/you-dont-need-jquery/" target="_blank" role="button">Get started</a> 
				                <a className="btn btn-lg btn-default btn-empty" href="http://jstherightway.org" role="button" target="_blank">Full Reference</a></p>
				            </div>
				          </div>
				        </div>
				        <div className="item">
				          <div className="item-bg bg-indigo"></div>
				          <div className="container">
				            <div className="carousel-caption">
				              <h2>HTML5 inside</h2>
				              <p>This library have been developed for today's standards, for a workflow careless about legacy browsers thanks to <a href="https://polyfill.io" target="_blank">polyfill services</a> and other 
				                available options to support legacy browsers.</p>
				              <p><a className="btn btn-lg btn-default btn-empty" href="https://github.com/thednp/bootstrap.native/wiki/Browser-support" role="button">More</a></p>
				            </div>
				          </div>
				        </div>
				        <div className="item">
				          <div className="item-bg bg-purple"></div>
				          <div className="container">
				            <div className="carousel-caption">
				              <h2>What's the fuzz?</h2>
				              <p>If you use mainly Bootstrap plugins in your projects, you may drop jQuery right away. Why load jQuery if you don't really need it? It's too old school!</p>
				              <p><a className="btn btn-lg btn-default btn-empty" href="http://jsperf.com/jquery-vs-native-element-performance" target="_blank" role="button">See Now</a></p>
				            </div>
				          </div>
				        </div>
				        <div className="item">
				          <div className="item-bg bg-red"></div>
				          <div className="container">
				            <div className="carousel-caption">
				              <h2>This was a <b>Carousel</b> example</h2>
				              <p>One component of this library that works just as the original jQuery plugin but with much less amount of code, higher code quality and with some smart optimizations.</p>
				              <p><a className="btn btn-lg btn-default btn-empty" href="#componentCarousel" role="button">How to use</a></p>
				            </div>
				          </div>
				        </div>
				      </div>

				    <a href="#myCarousel" className="left carousel-control" data-slide="prev"><span className="glyphicon glyphicon-chevron-left"></span></a>
				    <a href="#myCarousel" className="right carousel-control" data-slide="next"><span className="glyphicon glyphicon-chevron-right"></span></a>

				  </div>	
			  )
			}
}

export default Checkin;