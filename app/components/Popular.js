import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({selected, onUpdateLanguage}) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Phython']
    return (
        <div>
            <ul className='flex-center'>
                {languages.map((language) => (
                    <li key={language}>
                        <button className='btn-clear nav-link'
                        style={language === selected ? { color: 'rgb(187, 46, 31)'} : null}
                        onClick={() => onUpdateLanguage(language)}>
                            {language}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function ReposGrid ({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const {login, avatar_url } = owner

                return (
                    <li key={html_url}>
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            name={login}
                            href={html_url}
                        >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text="Github Username"> 
                                        <FaUser color='rgb(255, 191, 116)' size={22} />
                                        <a href={`https://github.com/${login}`}>
                                            {login}
                                        </a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()}stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                    {forks.toLocaleString()}forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 136, 147)' size={22} />
                                    {open_issues.toLocaleString()}open

                                </li>
                            </ul> 
                        </Card>                
                    </li>
                )
            })}
        </ul>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    updateLanguage: PropTypes.func
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}


export default class Popular extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedLangauge: 'All',
            repos: {},
            error: null
        }
        this.updateLanguage = this.updateLanguage.bind(this)
        this.isLoading = this.isLoading.bind(this)
    }

    componentDidMount () {
        this.updateLanguage(this.state.selectedLangauge)
    }
    
    updateLanguage(selectedLangauge) {
        this.setState({
            selectedLangauge: selectedLangauge,
            error: null
        })

if (!this.state.repos[selectedLangauge]) {
    fetchPopularRepos(selectedLangauge)
        .then((data) => {
            this.setState(({ repos }) => ({
                repos: {
                    ...repos,
                    [selectedLangauge]: data
              }
            }))
        })
        .catch(() => {
            console.warn('Error fetching repos:', error)

            this.setState({
                error: 'There was an error fetching the repositories.'
            })
        })
    }
}

    isLoading() {
        const { selectedLangauge, repos, error } = this.state

        return !repos[selectedLangauge] && error === null
    }

    render() {
        const { selectedLangauge, repos, error } = this.state
        return (
            <React.Fragment>
                <LanguagesNav 
                    selected={selectedLangauge}
                    onUpdateLanguage={this.updateLanguage}
                />
                {this.isLoading() && <Loading text={'Loading Repos'}/>}
                {error && <p className='center-text error'>{error}</p>}
                {repos[selectedLangauge] && <ReposGrid repos={repos[selectedLangauge]} />}
            </React.Fragment>
        )
    }
}
