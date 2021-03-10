import './App.css';

const time = new Date();
var timestamp = time.getTime();
var lastMonth = new Date(timestamp - 30 * 24 * 3600 * 1000);
var date = lastMonth.toLocaleDateString('zh-Hans-CN');
var api = `https://api.github.com/search/repositories?q=created:%3E${date}&sort=stars&order=desc&page=1`;
function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div class="itemRepo" >
                    <div class="left">
                        <img src="https://avatars.githubusercontent.com/u/1489983?v=4" class="imageUser" />
                    </div>
                    <div class="right">
                        <div class="reponame">Repository Name</div>
                        <div class="repodesc">Repository Description</div>
                        <div class="repouser">
                            <span class="boxed">Stars : 198</span>
                            <span class="boxed">Issues : 98</span>submitted 25 days by ymrabti
                        </div>
                    </div>
                </div>
            </header>

        </div>
    );
}

export default App;
