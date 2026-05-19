import React from 'react'
import Overview from '../components/Overview'

function Homepage() {
  return (
    <div className="homepage">
        <div className="top">
            <div className="topTitleCard">Overview</div>
            <div className="topTitleCard">Code</div>
            <div className="topTitleCard">Notes</div>
        </div>
        <div className="mid">
            <Overview/>
        </div>
        <div className="low"></div>
    </div>
  )
}

export default Homepage
