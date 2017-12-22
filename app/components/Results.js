var React = require('react');
var PropTypes = require('prop-types');
var queryString = require('query-string');
var api = require('../utils/api');
var Link = require('react-router-dom').Link;
var PlayerPreview = require('./PlayerPreview');

function Profile (props) {
  var info = props.info;
  return (
      <PlayerPreview
        avatar={info.avatar_url}
        username={info.login}>
          <ul className='space-list-items'>
            {info.name && <li>{info.name}</li>}
            {info.location && <li>{info.location}</li>}
            {info.company && <li>{info.company}</li>}
            <li>Followers: {info.followers}</li>
            <li>Following: {info.following}</li>
            <li>Public Repos: {info.public_repos}</li>
            {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
          </ul>
      </PlayerPreview>
  )
}

function Player (props) {
  return (
    <div>
      <h1 className='header'>{props.label}</h1>
      <h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
      <Profile info={props.profile} />
    </div>
  )
}

Player.propTypes = {
  label: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  profile: PropTypes.object.isRequired,
}


class Results extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true
    }
  }

  componentDidMount () {
    var players = queryString.parse(this.props.location.search);
    api.battle([players.playerOneName, players.playerTwoName])
      .then(function(results){
        if (results === null) {
          return this.setState(function(){
            return {
              error: 'Error. Check that both users exit on Github',
              loading: false
            }
          })
        }

        this.setState(function () {
          return {
            error: null,
            winner: results[0],
            loser: results[1],
            loading: false
          }
        })
      }.bind(this));
  }

  render() {
    var battle = {
      winner: this.state.winner,
      loser: this.state.loser,
      error: this.state.error,
      loading: this.state.loading
    }

    if (battle.loading === true) {
      return <div className='loader'></div>
    }

    if (battle.error){
      return (
        <div>
          <p>{battle.error}</p>
          <Link to='/battle'>Reset</Link>
        </div>
      )
    }

    return (
      <div className='row'>
        <Player
          label='Winner'
          score={battle.winner.score}
          profile={battle.winner.profile}
        />
        <Player
          label='Loser'
          score={battle.loser.score}
          profile={battle.loser.profile}
        />
      </div>
    )
  }
}

module.exports = Results;