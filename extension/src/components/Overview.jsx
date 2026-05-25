import React, { useState } from 'react'
import { MessagesSquare } from 'lucide-react'

function Overview({data, isLoading}) {

    if(isLoading || !data){
        return (
            <h1>Loading...</h1>
        )
    }

    console.log("data", data)

  return (
    <div className='midOverview'>
      <ul className='midList'>
        
        <li className='midListItem'>
                       
            
            <p className="listItemHeading">Approach</p> <br></br>
            <div className="midPara">
                        {data?.pattern} <br></br> {data?.approach}
            </div>
            
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Concepts to Learn</p> <br></br>
            <div className="midConcepts">
                {
                    data?.concepts?.map((concept, index)=>(
                        <div className='midConcept' key={index}>{concept}</div>
                    ))
                }
            </div>
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Similar Questions</p> <br></br>
            <div className="midQuestions">
                <ul>
                    {
                        data?.similarQuestions?.map((concept, index)=>(
                            <li key={index}>
                                {concept}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </li>
        <li className='midListItem'>
            <p className="listItemHeading">Complexity</p> <br></br>
            <div className="midComplexity">
                <div className="midTimeComplexity">
                    <div className="midComplexityHeading">Time</div>
                    <div className="midComplexityValue">{data?.complexity}</div>
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
