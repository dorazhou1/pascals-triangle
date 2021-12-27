import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
* TODO:
* - adjust triangle size
* - Make sure input is an int
* - Add up down arrows to change value
* - Change to immediately update on edit
* - Color Themes?
*/

function Info(props) {
    return(
    <div className="form">
        <label className='label'>Modulo:</label>
        <input className='input' type="text" id="mod" name="mod" placeholder="3"></input>
        <label className='label'>Number of rows:</label>
        <input className='input' type="text" id="rows" name="rows" placeholder="10"></input>
        <input className='btn' id="submit" type="submit" value="Submit" onClick={props.onClick}></input>
    </div> );
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value : this.props.value,
            color : Math.round(this.props.value%this.props.mod * parseInt("ffffff",16)/this.props.mod),
        }
        console.log(this.state.color)
    }
    render() {
        const color = '#' + this.state.color.toString(16);
        console.log(this.state.value);
        return (
        <div className='cell' style={{
            backgroundColor: color,
        }}>
            {this.state.value}
        </div>);
    }
}

class Triangle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            mod: this.props.mod,
            binomials: [
                [1],
                [1,1],
                [1,2,1],
                [1,3,3,1],
                [1,4,6,4,1],
                [1,5,10,10,5,1],
                [1,6,15,20,15,6,1],
                [1,7,21,35,35,21,7,1],
                [1,8,28,56,70,56,28,8,1],],
        }
    }
    extendBinomial(n) {
        let binomials = this.state.binomials;
        while(n >= binomials.length) {
            let s = binomials.length;
            let nextRow = [];
            nextRow[0] = 1;
            for(let i=1, prev=s-1; i<s; i++) {
                nextRow[i] = binomials[prev][i-1] + binomials[prev][i];
            }
            nextRow[s] = 1;
            binomials.push(nextRow);
        }
        this.setState({
            binomials: binomials,
        })
    }
    renderCell(i, k) {
        console.log("key="+k+" "+this.props.mod.toString(10))
        return (
            <Cell 
              key={k+" "+this.props.mod.toString(10)} value={i} mod={this.props.mod}
            />
        );
    }
    renderRow(i) {
        console.log(this.state.rows)
        let row = [];
        let binomials = [];
        if(i < this.state.binomials.length) {
            binomials = this.state.binomials[i];
        } else {
            this.extendBinomial(i);
            binomials = this.state.binomials[i];
        }
        for(let j = 0; j <= i; j++) {
            let val = binomials[j];
            row.push(this.renderCell(val, i*this.props.rows+j));
        }
        return (<div className='row'> {row} </div>)
    }
    render() {
        let tri = [];
        for(let i = 0; i < this.props.rows; i++) {
            tri.push(this.renderRow(i));
        }
        console.log(tri);
        return (<div className="tri">
            {tri}
        </div>);
    }
}

class Screen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 11,
            mod: 7,
        }

    }
    handleClick() {
        const rows = parseInt(document.getElementById("rows").value);
        const mod = parseInt(document.getElementById("mod").value);
        this.setState({
            rows: rows,
            mod: mod,
        }, () => {console.log(rows+" "+this.state.rows)});
        
    }
    render() {
        return(
        <div className="pascals-triangle">
            <h1>Pascal's Triangle Modulo Patterns</h1>
            <div className="info">
                <Info onClick={() => this.handleClick()}/>
            </div>
            <div className="triangle">
                <Triangle rows={this.state.rows} mod={this.state.mod} />
            </div>
        </div>);
    }
}

ReactDOM.render(
    <Screen />,
    document.getElementById('root')
  );
