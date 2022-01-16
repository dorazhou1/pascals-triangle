import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
/*
* TODO:
* - Color Themes
*/

function Info(props) {
    return(
    <div className="form">
        <div className='formVals'>
            <div className='item'>
                <label className='label'>Modulo:</label>
                <input className='input' type="text" id="mod" name="mod" placeholder="4"></input>
            </div>
            <div className='item'>
                <label className='label'>Number of rows:</label>
                <input className='input' type="text" id="rows" name="rows" placeholder="12"></input>
            </div>
            <div className='item'>
                <input className='btn' id="submit" type="submit" value="Submit" onClick={props.onClick}></input>
            </div>
        </div>
        <div className='item toggle'>
            <label className='label'>Show numbers</label>
            <label className="switch">
            <input type="checkbox" id="toggle" defaultChecked></input>
            <span className="slider round" onClick={props.toggleNums}></span>
        </label>
        </div>
    </div> );
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value : this.props.value,
            color : Math.round(this.props.value%this.props.mod * parseInt("ffffff",16)/this.props.mod),
            display : this.props.display,
        }
    }
    render() {
        let color = '#' + this.state.color.toString(16);
        let val = this.props.display;
        if(val > Number.MAX_SAFE_INTEGER)
            color: parseInt("fffff",16);
        if(Math.log(val)/Math.log(10) > 6) {
            val = "";
        }
        return (
        <div className='cell'>
            <div className="top" style = {{borderBottomColor: color}}></div>
            <div className="middle"  style={{backgroundColor: color,}}>
                {val}
            </div>
            <div className="bottom" style = {{borderTopColor: color}}></div>
        </div>);
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            row: this.props.row,
            display: this.props.display,
            vals: this.props.vals,
            mod: this.props.mod,
        };
    }
    
    renderCell(i, k) {
        // console.log("key="+k+" "+this.props.mod.toString(10))    
        
        return (
            <Cell 
              key={k+" "+this.props.mod.toString(10)} 
              value={i} 
              mod={this.props.mod} 
              display={this.props.display ? i : ""}
            />
        );
    }
    render() {
        let ret = [];
        for(let i = 0; i <= this.props.row; i++) {
            let val = this.state.vals[i];
            ret.push(this.renderCell(val, this.state.row*this.props.row+i));
        }
        return (<div className='row'> {ret} </div>)
    }
}

class Triangle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            mod: this.props.mod,
            display: this.props.display,
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
                if(binomials.length > 30) {
                    nextRow[i] = binomials[prev][i-1] % this.props.mod + binomials[prev][i] % this.props.mod;
                }
            }
            nextRow[s] = 1;
            binomials.push(nextRow);
        }
        this.setState({
            binomials: binomials,
        })
    }
    renderRow(i) {
        let binomials = [];
        if(i < this.state.binomials.length) {
            binomials = this.state.binomials[i];
        } else {
            this.extendBinomial(i);
            binomials = this.state.binomials[i];
        }
        // console.log(i+" "+this.state.mod+" "+binomials);
        return (
            <Row 
              key={i}
              row={i}
              display = {i < 20 && this.props.display}
              vals={binomials}
              mod={this.props.mod} 
            />
        );
    }
    render() {
        let tri = [];
        for(let i = 0; i < this.props.rows; i++) {
            tri.push(this.renderRow(i));
        }
        return (<div className="tri">
            {tri}
        </div>);
    }
}

class Screen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 12,
            mod: 4,
            display: true,
        }
    }
    handleClick() {
        const rowsVal = document.getElementById("rows").value;
        const modVal = document.getElementById("mod").value
        const rows = parseInt(rowsVal);
        const mod = parseInt(modVal);
        if(rowsVal != "" && rows == rowsVal)
            this.setState({rows: rows})
        if(modVal != "" && mod == modVal)
            this.setState({mod: mod})
    }
    toggleNums() {
        let onOff = document.getElementById("toggle").checked;
        this.setState({display: !onOff});
    }
    render() {
        return(
        <div className="pascals-triangle">
            <h1>Pascal's Triangle Modulo Patterns</h1>
            <div className="info">
                <Info onClick={() => this.handleClick()} toggleNums={() => this.toggleNums()}/>
            </div>
            <div className="triangle">
                <Triangle rows={this.state.rows} mod={this.state.mod} display={this.state.display} />
            </div>
        </div>);
    }
}

ReactDOM.render(
    <Screen />,
    document.getElementById('root')
  );
