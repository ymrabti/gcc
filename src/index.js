import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const time = new Date();
var timestamp = time.getTime();
var lastMonth = new Date(timestamp - 30 * 24 * 3600 * 1000);
var date = lastMonth.toJSON().substring(0, 10);

class RepositoriesItem extends React.Component {
    item = {};
    constructor(props) {
        super(props);
        this.item = props.dataitem
    }
    render() {
        const repoName = this.item["name"];
        const userName = this.item["owner"]["login"];
        const avatarUrl = this.item["owner"]["avatar_url"];
        const repoDesc = this.item["description"];
        const starCount = this.item["stargazers_count"];
        const issuesCount = this.item["open_issues_count"];
        const github = "https://github.com/";
        const daysAgo = Math.ceil((timestamp - new Date(this.item["pushed_at"]).getTime()) / (1000 * 3600 * 24));
        return <div className="itemRepo" >
        <div className="left">
            <a href={avatarUrl} rel="noreferrer" target="_blank">
                <img src={avatarUrl} className="imageUser" alt={`${userName}'Avatar`} />
            </a>
        </div>
        <div className="right">
            <div className="reponame">
                <a href={github+userName+"/"+repoName} rel="noreferrer" target="_blank">
                    {repoName}
                </a>
            </div>
            <div className="repodesc">{repoDesc}</div>
            <div className="repouser">
                <span className="boxed">Stars : {starCount}</span>
                <span className="boxed">Issues : {issuesCount}</span>
                    submitted {daysAgo}
                    days ago by <a href={github+userName} rel="noreferrer" target="_blank">{userName}</a>
            </div>
        </div>
    </div>;
    }
}
class RepositoriesList extends React.Component {
    state = {};
    controlPoint = 0;
    pageShouldLoaded = 1;
    constructor() {
        super();
        this.state = {
            isLoading: false,
            errorLoading: false,
            repositories: []
        };
    }
    componentDidMount() {
        this.loadMore();
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    handleScroll(_event) {
        if (!this.state.isLoading) {
            let scrollProgress = window.pageYOffset + window.innerHeight;
            if (scrollProgress >= this.controlPoint) {
                this.loadMore();
            }
        }
        
    }
    loadMore() {
        var url = `https://api.github.com/search/repositories?q=created:%3E${date}&sort=stars&order=desc&page=${this.pageShouldLoaded}`;
        this.setState({ isLoading: true });
        fetch(url)
            .then(response => response.json())
            .then(result => {
                this.setState({
                    repositories: this.state.repositories.concat(result["items"]),
                    isLoading: false, errorLoading: false
                });
                const newHeight = document.body.offsetHeight;
                this.pageShouldLoaded += 1;
                this.controlPoint = newHeight - window.innerHeight;
            })
            .catch(e => {
                console.log("error");
                this.setState({ isLoading: false, errorLoading: true });
            });

    }
    render() {
        const repos = this.state.repositories.filter(item => item["node_id"]).map(item => {
            return <RepositoriesItem key={item["node_id"]} dataitem={item} />;
        });
        return <div>
            {repos}
            {this.state.isLoading ? <p style={{ textAlign: "center", fontSize: "22px" }}>Loading ...</p> : ""}
            {this.state.errorLoading ? <p style={{ textAlign: "center", fontSize: "22px", color: "red" }}>Something went wrong !!</p> : ""}
        </div>
    }
}

ReactDOM.render(
    <RepositoriesList />,
    document.getElementById('root')
);

