import React, { useState } from 'react'
import {MessagesSquare } from 'lucide-react'

function Overview() {

  const [isLoading, setIsLoading] = useState(true);


  return (
    <div className='midOverview'>
      <ul className='midList'>
        <li className='midListItem'>
            <p className="listItemHeading">Approach</p> <br></br>
            {
                isLoading ? (<div className="midPara">loading...</div>):
                (
                    <div className="midPara">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias officiis quod consectetur, maxime atque officia ex debitis eos blanditiis quae.
                    </div>
                )
            
            }
            
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Concepts to Learn</p> <br></br>
            <div className="midConcepts">
                <div className="midConcept">Monotonic Stack</div>
                <div className="midConcept">Next Greater Element</div>
                <div className="midConcept">Array</div>
                <div className="midConcept">Stack</div>
            </div>
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Similar Questions</p> <br></br>
            <div className="midQuestions">
                <ul>
                    <li> Online Stock Spin</li>
                    <li> Max Element After</li>
                </ul>
            </div>
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Complexity</p> <br></br>
            <div className="midComplexity">
                <div className="midTimeComplexity">
                    <div className="midComplexityHeading">Time</div>
                    <div className="midComplexityValue">O(n)</div>
                </div>
                <div className="midSpaceComplexity">
                    <div className="midComplexityHeading">Space</div>
                    <div className="midComplexityValue">O(n)</div>
                </div>
            </div>
        </li>
      </ul>
      <div className="midAI">
        <button className="askAi"> <MessagesSquare/> Ask AI</button>
      </div>
    </div>
  )
}

export default Overview
