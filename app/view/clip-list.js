import React from 'react';
import fs from 'fs';
import update from 'react-addons-update';
import readline from 'readline';
import Clip from './clip';
import {ipcRenderer} from 'electron';

export default class ClipList extends React.Component {
  constructor() {
    super();
    this.state = {
      logs: []
    }
    this.readFile = this.readFile.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
    this.readFile();
  }

  deleteLog(i) {
    this.setState({
      logs: update(
        this.state.logs,
        {
          $splice: [[i, 1]]
        }
      )
    });
    let data = '';
    this.state.logs.map((log, index)=>{
      if(index != i) data += log + '\n';
    });
    ipcRenderer.send('asynchronous-message', data);
  }

  readFile() {
    const rl = readline.createInterface({
      input: fs.createReadStream('log.txt'),
    });

    rl.on('line', (line) => {
      this.setState({logs: this.state.logs.concat(line)});
    });
  }

  render() {
    return (
      <div>
        {this.state.logs.map((content,i)=><Clip contents = {content}
                                                deleteLog = {this.deleteLog}
                                                index = {i}/>)}
        <button onClick = {()=>{
          this.deleteLog(0);
        }}> hey </button>
      </div>
    );
  }
}
