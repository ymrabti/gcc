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
        var itemRender = <div className="itemRepo" >
            <div className="left">
                <img src={this.item["owner"]["avatar_url"]} className="imageUser" alt={`${this.item["owner"]["login"]}'Avatar`} />
            </div>
            <div className="right">
                <div className="reponame">{this.item["name"]}</div>
                <div className="repodesc">{this.item["description"]}</div>
                <div className="repouser">
                    <span className="boxed">Stars : {this.item["stargazers_count"]}</span>
                    <span className="boxed">Issues : {this.item["open_issues_count"]}</span>
            submitted {Math.ceil((timestamp - new Date(this.item["pushed_at"]).getTime()) / (1000 * 3600 * 24))}
            days ago by {this.item["owner"]["login"]}
                </div>
            </div>
        </div>;
        return itemRender;
    }
}
class RepositoriesList extends React.Component {
    state = {};
    controlPoint = {scrollProgress:Number,page:Number};
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
    handleScroll(event) {
        if (!this.state.isLoading) {
            //let root = event.srcElement.querySelector("#root");
            //let offsetHeight = root.offsetHeight;
            let scrollProgress = window.pageYOffset + window.innerHeight;
            if (scrollProgress >= this.controlPoint.scrollProgress) {
                this.loadMore();
                /* var interval = setInterval(() => {
                    if(scrollProgress - this.controlPoint.scrollProgress > 1000){
                        this.controlPoint = {
                            scrollProgress:offsetHeight - window.innerHeight,
                            page : this.pageShouldLoaded
                        };
                        clearInterval(interval);    
                    }
                }, 1000); */
            }
        }
        
    }
    newRepositories(repos) {
        this.state.repositories.forEach(function (currentValue, index) {
            //var exists = repos.find(item => item.node_id == currentValue.node_id);
            // exists ? this.setState({}) : false
        });
    }
    loadMore() {
        var url = `https://api.github.com/search/repositories?q=created:%3E${date}&sort=stars&order=desc&page=${this.pageShouldLoaded}`;
        this.setState({ isLoading: true });
        fetch(url)
            .then(response => response.json())
            .then(result => {
                this.newRepositories(result["items"]);
                this.setState({
                    repositories: this.state.repositories.concat(result["items"]),
                    isLoading: false, errorLoading: false
                });
                const newHeight = document.body.offsetHeight;
                this.pageShouldLoaded += 1;
                this.controlPoint = {
                    scrollProgress: newHeight - window.innerHeight,
                    page: this.pageShouldLoaded
                };
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

