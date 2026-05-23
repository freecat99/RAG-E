import React, { useState } from 'react'
import Overview from '../components/Overview'
import Code from '../components/Code'
import Notes from '../components/Notes'

function Homepage() {

  const[activeTab, setActiveTab] = useState('overview');

  return (
    <div className="homepage">
        <div className="top">
            <div className={`topTitleCard ${activeTab === "overview" ? "active" : ""}`} onClick={()=>setActiveTab('overview')}>Overview</div>
            <div className={`topTitleCard ${activeTab === "code" ? "active" : ""}`} onClick={()=>setActiveTab('code')}>Code</div>
            <div className={`topTitleCard ${activeTab === "notes" ? "active" : ""}`} onClick={()=>setActiveTab('notes')}>Notes</div>
        </div>
        <div className="mid">
            {activeTab==='overview' && <Overview/>}
            {activeTab==='code' && <Code/>}
            {activeTab==='notes' && <Notes/>}
        </div>
        <div className="low">
          <p className="discretion">AI can make mistakes. Use responsibly.</p>
        </div>
    </div>
  )
}

export default Homepage
