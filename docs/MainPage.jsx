import React from 'react';
import { relative } from 'path';
// import Navbar from './components/Navbar'

let angle = 0;
let angleInc = (Math.PI / 2);
let ma = Math.atan(1 / Math.sqrt(2));
let w = 30;
let numCells = 20;
let gridSize = numCells * w;
let grid1 = {};
let grid2 = {};
let gridHolder = [];
let cellAreas = [];
let gridInterface = {};
let deadBuffer;

window.setup = function setup() {
    pixelDensity(2);
    createCanvas('1280', 720, WEBGL);
    // deadBuffer = createGraphics(1280, 720, WEBGL);
    frameRate(30);
    // deadBuffer.pixelDensity(1)
    
    grid1 = initGrid();
    grid2 = initGrid();
    gridHolder = [grid1, grid2];
    randomGridState();
}

function initGrid() {
    let newGrid = {}
    for (let z = 0; z < numCells; z++) {
        newGrid[z] = {};
        for (let x = 0; x < numCells; x++) {
            newGrid[z][x] = {};
            newGrid[z][x].state = 0;
            newGrid[z][x].pos = [(x * w) - width / 2 + 5 - 250 + 35.4, -270, (z * w) - height / 2];
        }
    }
    return newGrid
}

let randomGridState = () => {
    let rand = 0;
    for (let z = 0; z < numCells; z++) {
        for (let x = 0; x < numCells; x++) {
            rand = Math.round(Math.random());
            grid1[z][x].state = rand;
            grid2[z][x].state = rand;
        }
    }
}
randomGridState = randomGridState.bind(this);

let clearGridState = () => {
    let rand = 0;
    for (let z = 0; z < numCells; z++) {
        for (let x = 0; x < numCells; x++) {
            rand = Math.round(Math.random());
            grid1[z][x].state = 0;
            grid2[z][x].state = 0;
        }
    }
}
clearGridState = clearGridState.bind(this);


// if prevState === 1 && < 2 neighbors -> 0
// if prevState === 1 && 2 - 3 neighbors -> 1
// if prevState === 1 && > 3 neighbors -> 0
// if prevState === 0 && 3 neighbors
function computeNextGrid() {
    // let start = performance.now()

    let prevGrid = gridHolder[0];
    let nextGrid = gridHolder[1];

    for (let z = 0; z < numCells; z++) {
        for (let x = 0; x < numCells; x++) {
            let prevCellNeighbors = countNeighbors(prevGrid, z, x)
            if (prevGrid[z][x].state === 1) {
                if (prevCellNeighbors < 2) {
                    nextGrid[z][x].state = 0;
                } else if (prevCellNeighbors > 3) {
                    nextGrid[z][x].state = 0;
                } else if (prevCellNeighbors === 2 || prevCellNeighbors === 3) {
                    nextGrid[z][x].state = 1;
                }
            } else {
                if (prevCellNeighbors === 3) {
                    nextGrid[z][x].state = 1;
                } else {
                    nextGrid[z][x].state = 0;
                }
            }
        }
    }
    gridHolder = [nextGrid, prevGrid];
    // let end = performance.now()

    // console.log(`Grid computation time: ${(end-start)}`);
}

function countNeighbors(grid, z, x) {
    let count = 0;
    let iAlt = 0;
    let jAlt = 0;

    for (let i = z - 1; i <= z + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
            iAlt = i;
            jAlt = j;

            if (grid[i] === undefined || grid[i][j] === undefined) {
                if (grid[i] === undefined) {
                    if (i < 0) {
                        iAlt = numCells - 1;
                    } else {
                        iAlt = 0;
                    }
                }
                if (grid[iAlt][j] === undefined) {
                    if (j < 0) {
                        jAlt = numCells - 1;
                    } else {
                        jAlt = 0;
                    }
                }
                count += grid[iAlt][jAlt].state;
            } else {
                count += grid[i][j].state;
            }

        }
    }
    count -= grid[z][x].state
    return count;
}

let controlFont = 'Bungee';
let aliveColor  = '#66ffdb';
let deadColor   = '#89bbc6';
let bColor      = '#84A0BF';
let titleColor  = '#494949'
let titleFont   = 'Megrim';
let titleTheme  = 'algae';
let titleAnim   = 'theme-fade 1.1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards';
let bigW        = w * 2.33;
let smallW      = w - 1;
let translateW  = 1280 / 2 - (w * numCells / 2 / 2);
let translateH  = 360;
let hPeaked;
let cardsInfo = [
    {
        cardType: 'noImage',
        image: '',
        header: 'Welcome to Game of Voxels',
        description: "This is a 3D isometric rendering of Conway’s famous Game of Life automata.",
        desc2: 'The project was coded with React.js and P5.js!',
        desc3: 'Rules for the simulation are shown in the following cards.',
    },
    {
        cardType: 'withImage',
        image: './assets/loneliness.webp',
        header: 'Loneliness',
        description: 'Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.',
    },
    {
        cardType: 'withImage',
        image: './assets/stasis.webp',
        header: 'Stasis',
        description: 'Any live cell with two or three live neighbours lives on to the next generation.',
    },
    {
        cardType: 'withImage',
        image: './assets/overcrowding.webp',
        header: 'Overcrowding',
        description: 'Any live cell with more than three live neighbours dies, as if by overpopulation.',
    },
    {
        cardType: 'withImage',
        image: './assets/reproduction.webp',
        header: 'Reproduction',
        description: 'Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.',
    },
    {
        cardType: 'noImage',
        image: '',
        header: 'Controls: ',
        description: "Click and Drag to revive cells",
        desc2: 'Press Space to Pause/Play',
        desc3: 'Press R to randomize the grid',
    },
];
let arrowSVG = (
    <svg width="45" height="45" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0)" >
            <path d="M12.6561 107.997L12.7169 108.055L12.7794 108.111L95.6325 182.712C101.036 187.578 109.36 187.141 114.225 181.738C119.09 176.335 118.654 168.011 113.251 163.146L38.912 96.2108L113.251 29.276C118.654 24.4109 119.09 16.0867 114.225 10.6835C109.36 5.28022 101.036 4.84398 95.6326 9.70908L12.7795 84.3103L12.5993 84.4726L12.4341 84.6501C9.58736 87.708 6.60356 91.4561 6.46328 96.0866C6.31515 100.976 9.32538 104.808 12.6561 107.997Z" fill="white" stroke="#545454" strokeWidth="11" />
        </g>
        <defs>
            <clipPath id="clip0">
                <rect width="192" height="192" fill="white" transform="translate(192 192) rotate(-180)" />
            </clipPath>
        </defs>
    </svg>
);

function addStyletoCards () {
    const styles = {
        withImage: {
            card: {
                gridTemplateRows: 'auto auto 35px'
            },
            header: {
                fontSize: '19px',
                fontFamily: controlFont,
                textShadow: '#A0A0A0 2px 2px'
            },
            description: {
                fontFamily: 'sans-serif',
                fontWeight: 400
            },
            image: {
                userSelect: 'none',
                width: '80%'
            }
        },
        noImage: {
            card: {
                gridTemplateRows: 'auto 35px'
            },
            header: {
                fontSize: '50px',
                margin: '10px 0',
                fontFamily: controlFont,
                textShadow: '#A0A0A0 3px 3px'
            },
            description: {
                fontSize: '20px',
                marginTop: '20px',
                boxSizing: 'border-box',
                fontFamily: 'sans-serif',
                fontWeight: 400
            },
            image: {display: 'none'}
        }
    }

    for (let index = 0; index < cardsInfo.length; index++) {
        cardsInfo[index].styles = styles[cardsInfo[index].cardType]
    }
}
addStyletoCards();

window.draw = function draw() {
    // deadBuffer.push()
    // deadBuffer.resetMatrix()
    // deadBuffer.background('rgba(0, 0, 0, 0)');
    // deadBuffer.ortho();
    // deadBuffer.rotateX(-ma);
    // deadBuffer.rotateY(-QUARTER_PI);
    // deadBuffer.translate(translateW, translateH);
    // deadBuffer.rectMode(CENTER);
    // deadBuffer.ambientLight(50, 50, 50);
    // deadBuffer.directionalLight(250, 250, 250, 290, 250, -360);
    // deadBuffer.fill('red')
    // deadBuffer.box(smallW, w, smallW);
    // deadBuffer.pop()
    // console.log(deadBuffer._styles);
    // image(deadBuffer, 0, 0, 0,0,0,0,0,0);

    background('rgba(0, 0, 0, 0)');
    ortho();
    rotateX(-ma);
    rotateY(-QUARTER_PI);
    translate(translateW, translateH);
    rectMode(CENTER);
    ambientLight(50, 50, 50);
    directionalLight(250, 250, 250, 290, 250, -360);
    angle += angleInc;
    let sinNow = Math.sin(angle);
    let h = map(sinNow, -1, 1, w, bigW);    

    if (sinNow == -1 && !noLoopBool && !spacePressed) {
        computeNextGrid();
    }

    if (h == 30) {
        hPeaked = false;
    } else if(h > 60 && !noLoopBool){
        hPeaked = true;
    }

    for (let z = 0; z < numCells; z++) {
        for (let x = 0; x < numCells; x++) {
            push();
            
            translate(...gridHolder[0][z][x].pos);
            if (gridHolder[0][z][x].state === 1 && gridHolder[1][z][x].state === 0) {
                //cell dies from last generation
                ambientMaterial(aliveColor);
                
                if (hPeaked) {
                    box(smallW, 69.9, smallW);
                } else {
                    box(smallW, h, smallW);
                }
            } else if (gridHolder[0][z][x].state === 1 && gridHolder[1][z][x].state === 1) {
                //cell stays alive from last generation
                ambientMaterial(aliveColor);
                box(smallW, bigW, smallW);
            } else if (gridHolder[0][z][x].state === 0 && gridHolder[1][z][x].state === 1) {
                //cell revives from last generation                
                ambientMaterial(deadColor);
                
                box(smallW, w, smallW);
            } else  {
                //cell stays dead from last generation
                ambientMaterial(deadColor)
                // deadBuffer.box()
                
                box(smallW, w, smallW);
                // rect(w,w,30,30)
                // deadBuffer.pop()
            }
            pop();
        }
        
    }
    // console.log(h);
    
    // console.log(frameRate());
}

function play () {
    noLoopBool = false;
    spacePressed = false;
    angle = 0;
    angleInc = (Math.PI / 2);

}

function pause () {
    angleInc = 0;
    angle = 3*(Math.PI / 4);
}

//Resume draw loop after grid manipulation
let noLoopBool = false;
document.addEventListener('mouseup', e=> {
    if(!modalContext.state.opened) play()
})
//Pause, play, and randomize commands
let spacePressed = false
document.addEventListener('keypress', e => {
    if (e.key === ' ') {
        spacePressed = !spacePressed;
        if (angleInc === 0) {
            play()
        } else{
            pause()
        }
    } else if(e.key === 'r'){
        randomGridState();
    }
});
//Clear grid command
document.addEventListener('keydown', e => {
    if (e.key === 'Backspace') {
        clearGridState();
    }
})


let mainPageContext;
class MainPage extends React.Component {

    constructor(props) {
        super(props)
        this.handleVoxelClick = this.handleVoxelClick.bind(this)
        this.handleVoxelOver = this.handleVoxelOver.bind(this);

        mainPageContext = this;

        let voxelTops = [];
        let fromBottomStr = '';
        let fromLeftStr = '';
        let voxId = '';

        for (let i = 19; i >= 0; i--) {
            let ib = 5.5 + (19-i)*12.22;
            let il = 45.4 + (19-i)*3.93;

            for (let j = 19; j >= 0; j--) {
                let fromBottom = ib + (19 - j) * (12.22);
                fromBottomStr = fromBottom + 'px';
                
                let fromLeft = il - (19-j) * 3.93;
                fromLeftStr = fromLeft + '%';
                voxId = j+'_'+i;

                voxelTops.push(
                    <div key={ j + i*20 } style={{visibility:'hidden', position: 'absolute', bottom: fromBottomStr, left: fromLeftStr, height: '5.5%', width: '5.5%', transition: 'bottom .1s', cursor: 'pointer' }}>
                        <div id={voxId} className='voxel' onMouseOver={this.handleVoxelOver} onClick={this.handleVoxelClick} style={{visibility:'visible', zIndex: 33, position: 'relative', backgroundColor: 'transparent', height: '100%', width: '100%', transform: 'rotateX(60deg) rotateY(0deg) rotateZ(45deg) scale3d(1,1,1)', transformOrigin: 'center bottom -2em' }}>
                        </div>
                    </div>
                );
            }
            
        }

        this.state = { 
            rotate: true, 
            transform: 'rotateX(60deg) rotateY(0deg) rotateZ(45deg) scale3d(1,1,1)',
            translate: 'translate3d(0, 0%, 0%)',
            voxelTops: voxelTops,
        }
    }

    handleVoxelOver(e){
        if (e.buttons == 1) {
            noLoopBool = true;
            angleInc = (Math.PI / 16);
            let coords = e.target.id.split('_')
            gridHolder[0][coords[1]][coords[0]].state = 1 
        } else{
            if (!spacePressed) {
                angleInc = (Math.PI / 2);
            } 
            noLoopBool = false;
        }
    }

    handleVoxelClick(e){
        noLoopBool = true;
        let coords = e.target.id.split('_');
        gridHolder[0][coords[1]][coords[0]].state = 1;
    }

    render() {
        return (
            <div id="Main-Page" className="flex-center">
                <Modal />

                <span className="title" style={{ userSelect: 'none', zIndex: -1, fontFamily: titleFont, fontSize: '60px', position: 'absolute', top: '17px', color: titleColor, textShadow: `3px 3px ${aliveColor}`, display: 'flex', justifyContent: 'center' }}>Game of Voxels</span>
                <span className="title" style={{ userSelect: 'none', zIndex: -1, fontFamily: titleFont, fontSize: '20px', position: 'absolute', top: '97px', color: titleColor, animation: titleAnim, display: 'flex', justifyContent: 'center' }}>{titleTheme}</span>

                <div style={{position: 'relative', width: '540px', height: '540px', backgroundColor: 'transparent', borderRadius: '5px', }}>
                    {this.state.voxelTops}
                </div>
                
                <div id="control-list">
                    <span className="control-li" style={{ marginLeft: '77px' }}><span style={{ color: deadColor }}>Click/Drag: </span>  Activate Cells</span>
                    <span className="control-li">|</span>
                    <span className="control-li"> <span style={{color: deadColor}}>Space:</span> Pause/Play</span>
                    <span className="control-li">|</span>
                    <span className="control-li"><span style={{ color: deadColor }}>R: </span> Randomize</span>
                    <span className="control-li">|</span>
                    <span className="control-li"><span style={{ color: deadColor }}>Backspace: </span> Clear</span>
                </div>
            </div>
        );
    }
}



let modalContext;
class Modal extends React.Component {
    constructor(props) {
        super(props);
        modalContext = this;
        this.toggleModal = this.toggleModal.bind(this)
        this.handleCardIter = this.handleCardIter.bind(this)

        this.state = {
            opened: true,
            display: {display: 'none'},
            currCard: 0
        }
    }

    componentDidMount () {
        pause()
        this.setState({display: {display: ''}})
    }

    toggleModal (e) {
        
        if(e !== 'head') {
            e.stopPropagation();
            e.preventDefault();
        }
        if (e === 'head' || e.target.id === 'information-modal') {
            if(this.state.opened) {
                play()
                this.setState({ opened: false, display: {display: 'none'} })
            } else {
                pause()
                this.setState({ opened: true, display: { display: '' } })
            }
        } 
    }

    handleCardIter (e, value) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ currCard: this.state.currCard + value })
    }

    render () {
        if ( this.state.opened ) {
            return (
                <div id="information-modal" className="flex-center" onClick={this.toggleModal} onDoubleClick={(e) => {e.preventDefault()}}>
                    <div id="card-stack" style={this.state.display}>
                        <svg width="40" height="40" viewBox="0 0 192 192" fill="none" id="xSVG" onClick={(e) => this.toggleModal('head')} xmlns="http://www.w3.org/2000/svg">
                            <path d="M47.8596 164.118L95.5893 116.388L143.319 164.118C148.201 169 156.115 169 160.997 164.118L163.118 161.997C168 157.115 168 149.201 163.118 144.319L115.388 96.5893L163.118 48.8596C168 43.9781 168 36.0635 163.118 31.182L160.997 29.0606C156.115 24.1791 148.201 24.1791 143.319 29.0606L95.5893 76.7904L47.8596 29.0606C42.9781 24.1791 35.0635 24.1791 30.182 29.0606L28.0606 31.182C23.1791 36.0635 23.1791 43.9781 28.0606 48.8596L75.7904 96.5893L28.0606 144.319C23.1791 149.201 23.1791 157.115 28.0606 161.997L30.182 164.118C35.0635 169 42.9781 169 47.8596 164.118Z" fill="white" stroke="#545454" strokeWidth="11" />
                        </svg>

                        {
                            this.state.currCard !== 0 &&
                            <div style={{ position: 'absolute', left: '10px', bottom: 'calc(50% - 22px)', zIndex: 2 }} onClick={(e) => this.handleCardIter(e, -1)} onDoubleClick={(e) => { e.stopPropagation() }}>
                                { arrowSVG }
                            </div>
                        }

                        <ModalCard numCards={cardsInfo.length}
                            cardIdx={this.state.currCard}
                            card={cardsInfo[this.state.currCard]} />

                        {
                            this.state.currCard < cardsInfo.length-1 &&
                            <div style={{ position: 'absolute', right: '10px', bottom: 'calc(50% - 22px)', zIndex: 2, transform: 'scaleX(-1)' }} onClick={(e) => this.handleCardIter(e, 1)}>
                                { arrowSVG }
                            </div>
                        }
                    </div>
                    
                
                </div>
            );
        } else {
            return null;
        }

    }
}

function CardDot(props) {
    return <div className={props.className} style={{ background: props.background, opacity: props.opacity, height: '10px', width: '10px', borderRadius: '50%', margin: '3px' }}></div>
}

function ModalCard(props) {
    let dotArray = []

    for (let index = 0; index < props.numCards; index++) {
        if (index === props.cardIdx) {
            dotArray.push(<CardDot key={`dot_${index}`} className={'pulsate-fwd'} background={titleColor} opacity={1}/>)
        } else {
            dotArray.push(<CardDot key={`dot_${index}`} className={''} background={bColor} opacity={0.5}/>)
        }
    }

    return (
        <section id='modal-card' style={ props.card.styles.card }>
            {props.card.cardType === 'withImage' &&
                <img src={props.card.image} alt={props.card.header} style={props.card.styles.image}/>
            }
            
            <div className="lower-card" >
                <span style={ props.card.styles.header } > { props.card.header } </span>

                <p style={ props.card.styles.description }> { props.card.description } </p>

                { props.card.desc2 &&
                    <p style={props.card.styles.description}> {props.card.desc2} </p>
                }
                {props.card.desc3 &&
                    <p style={props.card.styles.description}> {props.card.desc3} </p>
                }


            </div>
            <div className="dot-container"> { dotArray } </div>
        </section>
    )
}

let navbarContext;
class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.handleOptHover = this.handleOptHover.bind(this);
        this.handleOptOut = this.handleOptOut.bind(this);
        this.handleSettingsClick = this.handleSettingsClick.bind(this);

        this.state = {
            styles:{
                navStyle: {
                    position: 'absolute',
                    left: '0px',
                    backgroundColor: '#494949',
                    width: '75px',
                    height: '100%',

                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                },
                optStyle: {
                    width: 'fit-content',
                    position: 'relative',
                    marginLeft: 'auto',
                    height: '75px',
                    backgroundColor: '#494949',
                    display: 'flex',
                    // justifyContent: 'space-around',
                    // alignItems: 'center',
                    color: '#e0e0e0',
                    // fontFamily: 'Bungee',
                    fontSize: '22px',
                    borderBottom: '2px solid #e0e0e093',
                    borderRight: '2px solid #e0e0e093',
                    transition: 'width .2s',
                    cursor: 'pointer'
                },
                settingsStyle: {
                    width: 'fit-content',
                    position: 'relative',
                    marginLeft: 'auto',
                    height: '75px',
                    backgroundColor: '#494949',
                    display: 'flex',
                    color: '#e0e0e0',
                    // fontFamily: 'Bungee',
                    fontSize: '22px',
                    borderBottom: '2px solid #e0e0e093',
                    borderRight: '2px solid #e0e0e093',
                    transition: 'width .2s',
                    cursor: 'pointer'
                },
                gridStyles: {
                    bladeRunner: {
                        aliveColor: '#5a90fc',
                        deadColor: '#bf39a2',
                        bColor: 'radial-gradient(circle, rgba(145,38,123,0.9640231092436975) 0%, rgba(78,32,84,1) 91%, rgba(84,24,74,1) 100%)',
                        titleColor: '#bf39a2',
                        titleFont: 'bladerunner',
                        titleTheme: 'blade runner'
                    },
                    budapest:{
                        aliveColor: '#5c1e8c',
                        deadColor: '#CD9FCC',
                        bColor: '#FFC4EB',
                        titleColor: '#6d6d6d',
                        titleFont: 'budapest',
                        titleTheme: 'Budapest'
                    },
                    algae:{
                        aliveColor,
                        deadColor,
                        bColor,
                        titleColor: '#494949',
                        titleFont: 'Megrim',
                        titleTheme: 'algae'
                    },
                    chess:{
                        aliveColor: '#e2e2e2',
                        deadColor: '#2b2b2b',
                        bColor: '#e2e2e2',
                        titleColor: '#2b2b2b',
                        titleFont: 'Bungee',
                        titleTheme: 'Chess'
                    },
                }
            },
            colorSVGList: [
                <div key={5} id='voxelOpt' style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#494949'}} ><svg version="1.1" id="Capa_1" fill={aliveColor} stroke={deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609"><g><path d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>
            ],
            settings: null,
        };

        this.staticSVGList = [
            <div key={1} id='bladeRunner' className='color-opt' onClick={e => this.handleColorClick(e)} style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderLeft: '2px dotted #A3A3A3' }}><div style={{ position: 'absolute', width: '77px', height: '2px', background: '#A3A3A3', top: '-2px' }}></div><svg version="1.1" id="Capa_1" fill={this.state.styles.gridStyles.bladeRunner.aliveColor} strokeWidth='3' stroke={this.state.styles.gridStyles.bladeRunner.deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609" id='bladeRunner'><g id='bladeRunner'><path id='bladeRunner' d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>,
            <div key={2} id='budapest' className='color-opt' onClick={e => this.handleColorClick(e)} style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderLeft: '2px dotted #A3A3A3' }}><div style={{ position: 'absolute', width: '77px', height: '2px', background: '#A3A3A3', top: '-2px' }}></div><svg version="1.1" id="Capa_1" fill={this.state.styles.gridStyles.budapest.aliveColor} strokeWidth='3' stroke={this.state.styles.gridStyles.budapest.deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609" id='budapest'><g id='budapest'><path id='budapest' d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>,
            <div key={3} id='algae' className='color-opt' onClick={e => this.handleColorClick(e)} style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderLeft: '2px dotted #A3A3A3' }}><div style={{ position: 'absolute', width: '77px', height: '2px', background: '#A3A3A3', top: '-2px' }}></div><svg version="1.1" id="Capa_1" fill={this.state.styles.gridStyles.algae.aliveColor} strokeWidth='3' stroke={this.state.styles.gridStyles.algae.deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609" id='algae'><g id='algae'><path id='algae' d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>,
            <div key={4} id='chess' className='color-opt' onClick={e => this.handleColorClick(e)} style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderLeft: '2px dotted #A3A3A3' }}><div style={{ position: 'absolute', width: '77px', height: '2px', background: '#A3A3A3', top: '-2px' }}></div><svg version="1.1" id="Capa_1" fill={this.state.styles.gridStyles.chess.aliveColor} strokeWidth='3' stroke={this.state.styles.gridStyles.chess.deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609" id='chess'><g id='chess'><path id='chess' d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>,
        ];
        this.colorLength = 76*(this.staticSVGList.length+1)+1;
        navbarContext = this;
        this.settings = (<Settings key={6}/>);
        this.headInterval;
    }

    handleHeadClick(e){
        modalContext.setState({ currCard: 0 })
        modalContext.toggleModal('head')
    }

    handleOptHover(e){        
        if (e.target.id == 'voxelColorList' || e.target.id == 'voxelOpt') {
            this.setState({colorSVGList: [
                this.state.colorSVGList[0],
                ...this.staticSVGList
            ]})
        }
    }
    handleOptOut(e) {
        if (e.pageY <= 75 || e.pageY > 150 || e.pageX > this.colorLength) {
            this.setState({
                colorSVGList: [
                    this.state.colorSVGList[0]
                ]
            })
        }
    }
    handleColorClick(e){

        if (e.target.id) {
            let newTheme = this.state.styles.gridStyles[e.target.id];

            aliveColor = newTheme.aliveColor;
            deadColor = newTheme.deadColor;
            bColor = newTheme.bColor;
            titleColor = newTheme.titleColor;
            titleFont = newTheme.titleFont;
            titleTheme = newTheme.titleTheme;

            document.getElementsByTagName("BODY")[0].style.background = bColor;

            if (titleAnim === 'theme-fade 1.1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards') {
                titleAnim = 'theme-fade2 1.1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards'
            } else {
                titleAnim = 'theme-fade 1.1s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards';
            }

            mainPageContext.setState(mainPageContext.state)
            this.setState({
                colorSVGList: [
                    <div id='voxelOpt' style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><svg version="1.1" id="Capa_1" fill={aliveColor} strokeWidth='3' stroke={deadColor} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33px" height="33px" viewBox="0 0 93.609 93.609"><g><path d="M93.536,66.47c0-0.055,0.028-0.109,0.028-0.191V7.423c0-0.027,0-0.055,0-0.083c0-0.22-0.028-0.44-0.057-0.632 c-0.027-0.083-0.055-0.192-0.055-0.275c-0.027-0.083-0.027-0.165-0.055-0.248c-0.028-0.055-0.057-0.11-0.084-0.192 c-0.026-0.11-0.082-0.193-0.109-0.275c-0.055-0.137-0.137-0.275-0.221-0.413c-0.055-0.083-0.082-0.137-0.138-0.22 c-0.137-0.193-0.274-0.357-0.411-0.522c-0.027-0.028-0.027-0.028-0.027-0.055c-0.165-0.165-0.357-0.303-0.551-0.44 c-0.056-0.055-0.138-0.083-0.221-0.138c-0.138-0.083-0.273-0.165-0.412-0.22c-0.082-0.028-0.164-0.083-0.248-0.11 c-0.164-0.055-0.302-0.11-0.467-0.137c-0.083-0.028-0.165-0.055-0.248-0.055c-0.246-0.055-0.494-0.083-0.742-0.083H35.121 c-2.448,0-5.803,0.743-8.003,1.788L2.395,16.829c-0.11,0.055-0.22,0.138-0.33,0.193c-0.083,0.055-0.165,0.083-0.248,0.137 c-0.193,0.138-0.385,0.303-0.578,0.468c0,0,0,0-0.027,0.027c-0.165,0.165-0.33,0.357-0.468,0.55 c-0.055,0.083-0.083,0.137-0.138,0.22c-0.082,0.138-0.165,0.275-0.22,0.413c-0.027,0.083-0.083,0.192-0.11,0.275 c-0.055,0.138-0.11,0.275-0.138,0.44c-0.027,0.11-0.055,0.192-0.055,0.302c-0.027,0.165-0.055,0.33-0.055,0.495 c0,0.055-0.028,0.11-0.028,0.192v65.62c0,0.027,0,0.083,0,0.109c0,0.221,0.028,0.414,0.055,0.633 c0.027,0.082,0.027,0.193,0.055,0.275c0.027,0.082,0.027,0.166,0.055,0.248c0.028,0.082,0.055,0.137,0.083,0.191 c0.028,0.083,0.083,0.191,0.11,0.273c0.083,0.14,0.137,0.275,0.22,0.44c0.055,0.083,0.083,0.138,0.138,0.192 c0.137,0.193,0.275,0.385,0.467,0.551l0.028,0.027c0.165,0.164,0.33,0.303,0.522,0.438c0.055,0.056,0.137,0.082,0.192,0.138 c0.138,0.084,0.275,0.166,0.44,0.221c0.083,0.027,0.165,0.082,0.248,0.109c0.165,0.057,0.303,0.11,0.468,0.139 c0.083,0.027,0.165,0.055,0.248,0.055c0.248,0.055,0.495,0.082,0.742,0.082h64.025c2.889,0,6.463-1.484,8.498-3.547l15.018-15.209 C93.206,70.019,93.839,68.203,93.536,66.47z M8.253,24.64l19.691-0.028v39.851c-0.33,0.193-0.66,0.386-0.935,0.578L8.28,78.271 V24.64H8.253z M36.14,24.584l31.16-0.055l0.026,37.734l-31.188,0.109V24.584H36.14z M75.523,22.522l9.846-7.068v46.754 l-9.818,0.027L75.523,22.522z M70.105,16.334L36.14,16.389v-4.84h40.592L70.105,16.334z M27.944,13.831v2.585h-5.473L27.944,13.831 z M31.739,71.751c0.797-0.551,2.64-1.156,3.603-1.156l32.014-0.109v11.605H17.081L31.739,71.751z M75.55,76.206v-5.748l5.692-0.027 L75.55,76.206z" /></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></div>,
                    ...this.staticSVGList
                ]
            })
        } 

    }
    handleSettingsClick(e){
        let newStyle = Object.assign({}, this.state.styles.settingsStyle) ;
        let newStyleObj = Object.assign({}, this.state.styles);
        // debugger;
        
        if (!this.state.settings) {
            newStyle.borderRight = '2px dotted #e0e0e093';
            newStyleObj.settingsStyle = newStyle;
            this.setState({ settings: this.settings , styles: newStyleObj})
        } else if (e.target.id === "settings-menu-opt"){
            newStyle.borderRight = '2px solid #e0e0e093';
            newStyleObj.settingsStyle = newStyle;
            this.setState({ settings: null, styles: newStyleObj  })
        }
        
    }

    render() {
        return (
        <nav style={this.state.styles.navStyle}>
            <div style={{ zIndex: 3 }} onClick={e => this.handleHeadClick(e)} className="menu-opt" style={{width: 'fit-content',
                    position: 'relative',
                    marginLeft: 'auto',
                    height: '75px',
                    backgroundColor: '#494949',
                    display: 'flex',
                    color: '#e0e0e0',
                    fontSize: '22px',
                    borderBottom: '2px solid #e0e0e093',
                    borderRight: '2px solid #e0e0e093',
                    transition: 'width .2s',
                    cursor: 'pointer'}}>
                <div style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}  >
                    <img key={8} id="conways-head" src="./assets/conwayHead.webp" height='60px' width='auto' />
                </div>
            </div>

            <div id='voxelColorList' onMouseOver={e => this.handleOptHover(e)} onMouseOut={e => this.handleOptOut(e)} className="menu-opt" style={{
            width: 'fit-content',
            marginLeft: 'auto',
            height: '75px',
            display: 'flex',
            color: '#e0e0e0',
            fontSize: '22px',
                borderBottom: '2px solid #A3A3A3',
                borderRight: '2px solid #A3A3A3',
            transition: 'width .2s',
            cursor: 'pointer'
        }}>
            {this.state.colorSVGList}
        </div>

            <div id="settings-menu-opt" className="menu-opt" style={this.state.styles.settingsStyle} onClick={e => this.handleSettingsClick(e)} >
                <div style={{ width: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} id="settings-menu-opt" >
                    <svg version="1.1" id="settings-menu-opt" xmlns="http://www.w3.org/2000/svg" height='30px' width='30px' x="0px" y="0px" viewBox="0 0 234 234">
                        <g>
                            <path style={{ fill: this.state.styles.optStyle.color }} d="M7.5,42.571h39.235c3.327,12.646,14.856,22,28.531,22s25.204-9.354,28.531-22H226.5 c4.142,0,7.5-3.358,7.5-7.5s-3.358-7.5-7.5-7.5H103.796c-3.327-12.646-14.856-22-28.531-22s-25.204,9.354-28.531,22H7.5 c-4.142,0-7.5,3.358-7.5,7.5S3.358,42.571,7.5,42.571z M75.266,20.571c7.995,0,14.5,6.505,14.5,14.5s-6.505,14.5-14.5,14.5 c-7.995,0-14.5-6.505-14.5-14.5S67.271,20.571,75.266,20.571z" />
                            <path style={{ fill: this.state.styles.optStyle.color }} d="M226.5,109.5h-49.99c-3.327-12.646-14.856-22-28.531-22c-13.675,0-25.204,9.354-28.531,22H7.5 c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h111.949c3.327,12.645,14.856,22,28.531,22c13.675,0,25.204-9.355,28.531-22h49.99 c4.142,0,7.5-3.358,7.5-7.5S230.642,109.5,226.5,109.5z M147.98,131.5c-7.995,0-14.5-6.505-14.5-14.5s6.505-14.5,14.5-14.5 c7.995,0,14.5,6.505,14.5,14.5S155.975,131.5,147.98,131.5z" />
                            <path style={{ fill: this.state.styles.optStyle.color }} d="M226.5,191.429H103.796c-3.327-12.645-14.856-22-28.531-22s-25.204,9.355-28.531,22H7.5 c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h39.235c3.327,12.646,14.856,22,28.531,22s25.204-9.354,28.531-22H226.5 c4.142,0,7.5-3.358,7.5-7.5C234,194.787,230.642,191.429,226.5,191.429z M75.266,213.429c-7.995,0-14.5-6.505-14.5-14.5 s6.505-14.5,14.5-14.5c7.995,0,14.5,6.505,14.5,14.5S83.261,213.429,75.266,213.429z" />
                        </g>
                    </svg>
                </div>
                {this.state.settings}
            </div>

            <div className="quadrants" style={{ width: '78px', height: '84px', borderBottom: '2px solid rgb(160, 160, 160)', borderRight: '2px solid rgb(160, 160, 160)'}}>
                    <a href="https://github.com/mvaleriani">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1024 1024" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#E0E0E0" />
                            <div xmlns="" id="divScriptsUsed" style={{display: 'none'}} /><script xmlns="" id="globalVarsDetection" src="chrome-extension://cmkdbmfndkfgebldhnkbfhlneefdaaip/js/wrs_env.js" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/michael-valeriani/">
                        <svg width="100%" height="100%" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 382 382" style={{ enableBackground: 'new 0 0 382 382', background: '#E0E0E0', borderRadius: '5px'}} >
                            <path style={{ fill: '#3473B0'}} d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889
                            C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056
                            H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806
                            c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1
                            s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73
                            c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079
                            c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426
                            c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472
                            L341.91,330.654L341.91,330.654z"/>
                        </svg>
                    </a>
                    <a href="http://michaelvaleriani.io/">
                        <img src="./assets/personalIcon.webp" style={{width: '100%', height: '100%', borderRadius: '3px'}} alt="Portfolio Site"/>
                    </a>
            </div>

            <div style={{ flex: 1, width: '76px', borderRight: '2px solid #e0e0e093', backgroundColor: '#494949'}}></div>
        </nav>)
    }
}

class Settings extends React.Component{
    constructor(props){
        super(props);
        this.handleResolution = this.handleResolution.bind(this);
        this.handleGridSpeed = this.handleGridSpeed.bind(this);
    }

    componentDidMount(){
        document.getElementById("better-set").classList.add("selected-setting");
        document.getElementById("standard-set").classList.add("selected-setting");
    }

    handleResolution(e) {
        document.getElementById("good-set").classList.remove("selected-setting");
        document.getElementById("better-set").classList.remove("selected-setting");
        document.getElementById("best-set").classList.remove("selected-setting");
        
        let resChange = e.target.innerText;
        
        if (resChange === "Good") {
            pixelDensity(1);
            document.getElementById("good-set").classList.add("selected-setting");
            
        } else if (resChange === "Better") {
            pixelDensity(2);
            document.getElementById("better-set").classList.add("selected-setting");
        } else{
            pixelDensity(4);
            document.getElementById("best-set").classList.add("selected-setting");
        }
    }

    handleGridSpeed(e){
        document.getElementById("slo-mo-set").classList.remove("selected-setting");
        document.getElementById("standard-set").classList.remove("selected-setting");
        document.getElementById("lightning-set").classList.remove("selected-setting");

        let speedChange = e.target.innerText;

        if (speedChange === "Slo-mo") {
            frameRate(8);
            document.getElementById("slo-mo-set").classList.add("selected-setting");
        } else if (speedChange === "Standard") {
            frameRate(30);
            document.getElementById("standard-set").classList.add("selected-setting");
        } else {
            frameRate(60);
            document.getElementById("lightning-set").classList.add("selected-setting");
        }
    }

    render(){
        return (
            <aside id="settings-list" style={{ zIndex: -1, borderBottomRightRadius: '4px', borderTopRightRadius: '4px', borderRight: '2px solid #e0e0e093', borderTop: '2px solid #e0e0e093', borderBottom: '2px solid #e0e0e093', boxSizing: 'border-box', position: 'absolute', background: 'rgba(73, 73, 73, .9)', top:'-2px', left: '77px', zIndex: '1'}}>
                <div id="resolution">
                    <div className="setting-name">RESOLUTION</div>
                    <div className="settings-opts" >
                        <div id="good-set" className="settings-opt flex-center" onClick={e => this.handleResolution(e)}>Good</div>
                        <div id="better-set" className="settings-opt flex-center" onClick={e => this.handleResolution(e)}>Better</div>
                        <div id="best-set" className="settings-opt flex-center" onClick={e => this.handleResolution(e)}>Best</div>
                    </div>
                        
                </div>
                <div id="grid-speed">
                    <div className="setting-name">GRID SPEED</div>
                    <div style={{margin: '5px'}} className="settings-opts" >
                        <div id="slo-mo-set" className="settings-opt flex-center" onClick={e => this.handleGridSpeed(e)}>Slo-mo</div>
                        <div id="standard-set" className="settings-opt flex-center" onClick={e => this.handleGridSpeed(e)}>Standard</div>
                        <div id="lightning-set" className="settings-opt flex-center" onClick={e => this.handleGridSpeed(e)}>Lightning</div>
                    </div>
                </div>
                
            </aside>
        );
    }
}



export {MainPage, Navbar, Settings};
