import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'

import LatestMatch from '../LatestMatch'

import MatchCard from '../MatchCard'

import './index.css'

class TeamMatches extends Component {
  state = {
    teamMatchesDetails: [],
    isLoading: true,
    wonCount: 0,
    lossCount: 0,
    drawCount: 0,
  }

  componentDidMount() {
    this.gettingTeamMatches()
  }

  gettingTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()
    console.log(data)
    const updatedData = {
      teamBannerUrl: data.team_banner_url,
      latestMatchDetails: data.latest_match_details,
      recentMatches: data.recent_matches,
    }
    const lostMatches = updatedData.recentMatches.filter(
      eachOne => eachOne.match_status === 'Lost',
    )
    const wonMatches = updatedData.recentMatches.filter(
      eachOne => eachOne.match_status === 'Won',
    )
    const drawMatches = updatedData.recentMatches.filter(
      eachOne => eachOne.match_status === 'Draw',
    )
    this.setState({
      teamMatchesDetails: updatedData,
      isLoading: false,
      wonCount: wonMatches.length,
      lossCount: lostMatches.length,
      drawCount: drawMatches.length,
    })
  }

  onBackButton = () => {
    const {history} = this.props
    history.replace('/')
  }

  render() {
    const {teamMatchesDetails, isLoading, lossCount, wonCount, drawCount} =
      this.state
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params

    const data = [
      {
        count: lossCount,
        status: 'Loss',
      },
      {
        count: wonCount,
        status: 'Won',
      },
      {
        count: drawCount,
        status: 'Draw',
      },
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FF8042']

    return (
      <div className="TeamMatches-page-container">
        {isLoading ? (
          <div data-testid="loader">
            <Loader type="TailSpin" width={50} height={50} color="#00BFF" />
          </div>
        ) : (
          <div>
            <img
              className="team-banner-image"
              alt="team banner"
              src={teamMatchesDetails.teamBannerUrl}
            />
            <p>Latest Matches</p>
            <ul className="latestMatch-ul-container">
              <LatestMatch
                details={teamMatchesDetails.latestMatchDetails}
                key={teamMatchesDetails.latestMatchDetails.id}
              />
            </ul>
            <ul className="MatchCard-ul-container">
              {teamMatchesDetails.recentMatches.map(eachGame => (
                <MatchCard matchDetails={eachGame} key={eachGame.id} />
              ))}
            </ul>
            <div className="pie-Container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    cx="70%"
                    cy="40%"
                    data={data}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="40%"
                    outerRadius="70%"
                    dataKey="count"
                    nameKey="status"
                  >
                    <Cell name="Lost Matches" fill="#fecba6" />
                    <Cell name="Won Matches" fill="#b3d23f" />
                    <Cell name="Draw Matches" fill="#a44c9e" />
                  </Pie>
                  <Legend
                    iconType="circle"
                    layout="vertical"
                    verticalAlign="middle"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <button className="back-button" onClick={this.onBackButton}>
              BACK
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default TeamMatches
