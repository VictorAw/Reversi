let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  return [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, new Piece("white"), new Piece("black"), null, null, null],
    [null, null, null, new Piece("black"), new Piece("white"), null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ]
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if(!this.isValidPos(pos)){
    throw new Error("Not valid pos!");
  }
  let row = pos[0];
  let col = pos[1];
  return this.grid[row][col];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.getPiece(pos) == null){
    return false
  }
  return this.getPiece(pos).color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== null
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove("white") && !this.hasMove("black");
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let row = pos[0];
  let col = pos[1];
  return row >= 0 && row <= 7 && col >= 0 && col <= 7;
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  if (!board.isValidPos(pos)){
    return null;
  }
  if (board.isMine(pos, color)){
    if (piecesToFlip.length===0){
      return null
    }
    return piecesToFlip;
  }
  if (!board.isOccupied(pos)){
    return null;
  }

  piecesToFlip.push(board.getPiece(pos))
  let next_pos = [pos[0] + dir[0], pos[1] + dir[1]]
  return _positionsToFlip(board, next_pos, color, dir, piecesToFlip)
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)){
    throw Error('Invalid Move')
  }

  let row = pos[0];
  let col = pos[1];

  this.grid[row][col] = new Piece(color)
  let pieces = []
  Board.DIRS.forEach ( dir => {
    let next_pos = [pos[0] + dir[0], pos[1] + dir[1]];
    let pieces_to_concat = _positionsToFlip(this, next_pos, color, dir, [])
    if (pieces_to_concat !== null){
      pieces = pieces.concat(pieces_to_concat)
    }
  })
  pieces.forEach ( piece => {
    piece.flip()
  })
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if(!this.isValidPos(pos)){
    return false;
  }

  if(this.isOccupied(pos)){
    return false;
  }

  let valid = false;

  Board.DIRS.forEach( dir => {
    let next_pos = [pos[0] + dir[0], pos[1] + dir[1]];
    let pieces = _positionsToFlip(this, next_pos, color, dir, []);
    if (pieces !== null){
      valid = true;
    }
  })
  return valid;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let moves = []
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (this.validMove([i,j], color)){
        moves.push([i,j])
      }
    }
  }
  return moves;
};

module.exports = Board;
