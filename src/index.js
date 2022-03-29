import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				line: lines[i],
			};
		}
	}
	return {
		winner: null,
	};
}

function Square(props) {
	const highlightClass = 'square' + (props.highlight ? ' highlight' : '');
	return (
		<button className={highlightClass} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		const winLine = this.props.winnerLine;
		return (
			<Square
				key={i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				highlight={winLine && winLine.includes(i)}
			/>
		);
	}

	render() {
		let boardSquares = [];
		for (let row = 0; row < 3; row++) {
			let boardRow = [];
			for (let col = 0; col < 3; col++) {
				boardRow.push(
					<span key={row * 3 + col}>{this.renderSquare(row * 3 + col)}</span>
				);
			}
			boardSquares.push(
				<div className="board-row" key={row}>
					{boardRow}
				</div>
			);
		}

		return <div>{boardSquares}</div>;
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
			isAscendingOrder: true,
			isGameOver: false,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares).winner || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : '0';
		const isGameOver =
			this.state.stepNumber === 8 || calculateWinner(squares).winner;
		this.setState({
			history: history.concat([{ squares: squares, latestMoveSquare: i }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			isGameOver: isGameOver,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	handleSortToggle() {
		this.setState({
			isAscendingOrder: !this.state.isAscendingOrder,
		});
	}

	render() {
		const history = this.state.history;
		const stepNumber = this.state.stepNumber;
		const current = history[stepNumber];
		const winnerInfo = calculateWinner(current.squares);
		const winner = winnerInfo.winner;
		const moves = history.map((step, move) => {
			const latestMoveSquare = step.latestMoveSquare;
			const col = 1 + (latestMoveSquare % 3);
			const row = 1 + Math.floor(latestMoveSquare / 3);
			const description = move
				? `Go to move #${move} (${col}, ${row})`
				: 'Go to game start';
			return (
				<li key={move}>
					<button
						className={move === stepNumber ? 'move-list-item-selected' : ''}
						onClick={() => this.jumpTo(move)}
					>
						{description}
					</button>
				</li>
			);
		});
		const isAscendingOrder = this.state.isAscendingOrder;
		if (!isAscendingOrder) {
			moves.reverse();
		}
		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
		}
		const gameOver = this.state.isGameOver ? 'GAME OVER!' : '';
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
						winnerLine={winnerInfo.line}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => this.handleSortToggle()}>
						{isAscendingOrder ? 'Descending order' : 'Ascending order'}
					</button>
					<ol>{moves}</ol>
					<h2>{gameOver}</h2>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));


