import React, { useEffect, useState } from 'react';

import Overview from '../components/Overview';
import Code from '../components/Code';
import Notes from '../components/Notes';

function Homepage() {

  const [activeTab, setActiveTab] = useState('overview');

  const [problemData, setProblemData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const getAnswer = (problemData) => {
    
    const response = fetch('http://localhost:1601/api/search/answer', {
      method: POST,
      body: JSON.stringify({
        question: problemData
      }),
      headers:{
        "Content-type": 'application/json'
      }
    })

    const result = response.json();
    console.log(result);
  }

  useEffect(() => {

    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },

      (tabs) => {

        chrome.tabs.sendMessage(
          tabs[0].id,

          {
            action: "GET_PROBLEM"
          },

          (response) => {

            console.log(response);

            setProblemData(response);
          }
        );
      }
    );

    const listener = (message) => {

      if(message.type === "PROBLEM_CHANGED") {

        console.log("New Problem:", message.data);

        setProblemData(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {

      chrome.runtime.onMessage.removeListener(listener);
    };

  }, []);

  useEffect(()=>{
    getAnswer();
  }, [problemData])


  return (
    <div className="homepage">

        <div className="top">

            <div
              className={`topTitleCard ${
                activeTab === "overview"
                ? "active"
                : ""
              }`}

              onClick={() =>
                setActiveTab('overview')
              }
            >
              Overview
            </div>

            <div
              className={`topTitleCard ${
                activeTab === "code"
                ? "active"
                : ""
              }`}

              onClick={() =>
                setActiveTab('code')
              }
            >
              Code
            </div>

            <div
              className={`topTitleCard ${
                activeTab === "notes"
                ? "active"
                : ""
              }`}

              onClick={() =>
                setActiveTab('notes')
              }
            >
              Notes
            </div>

        </div>

        <div className="mid">

            <h2>
              {problemData?.title}
            </h2>

            <p>
              {problemData?.description}
            </p>

            {activeTab==='overview' &&
              <Overview problemData={problemData}/>
            }

            {activeTab==='code' &&
              <Code problemData={problemData}/>
            }

            {activeTab==='notes' &&
              <Notes/>
            }

        </div>

        <div className="low">
          <p className="discretion">
            AI can make mistakes.
            Use responsibly.
          </p>
        </div>

    </div>
  );
}

export default Homepage;