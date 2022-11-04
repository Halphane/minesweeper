import { Component } from '@angular/core';
import { TimerService } from '../service/timer.service';
import { BoardComponent } from './board/board.component';
import { TilesComponent } from './board/tiles/tiles.component';
import { DifficultiesEnum } from './Enums/difficulties.enum';
import { DifficultyOption } from './interfaces/difficulties_options.interface';

@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MineSweeperComponent{
  
  selectedDifficulty: string = '';
  difficultiesEnum = DifficultiesEnum;
  winState: string = '';
  timerService: TimerService = new TimerService();
  firstClick: boolean = true;
  flagCount: number;
  mineDetectorStyles = [
    'one',
    'two',
    'tree',
    'four',
    'five',
    'six',
    'seven',
    'eight'
  ]
  difficultiesConfig: DifficultyOption[] = [
    {
      difficulty: DifficultiesEnum.easy,
      rows: 8,
      columns: 10,
      mineCount: 10,
    },
    {
      difficulty: DifficultiesEnum.medium,
      rows: 14,
      columns: 18,
      mineCount: 40
    },
    {
      difficulty: DifficultiesEnum.hard,
      rows: 20,
      columns: 26,
      mineCount: 99,
    },
  ]
  board: BoardComponent;

  constructor() {
    this.flagCount = this.difficultiesConfig[DifficultiesEnum.easy].mineCount;
    this.board = new BoardComponent(this.difficultiesConfig[DifficultiesEnum.easy]);
  }

  onSelect(value: string): void {
    this.selectedDifficulty = value;
    this.flagCount = this.difficultiesConfig[this.Number(this.selectedDifficulty)].mineCount;
    this.board = new BoardComponent(this.difficultiesConfig[Number(this.selectedDifficulty)]);
  }

  Number(value: string): number{
    return Number(value);
  }

  onLeftClick(tile: TilesComponent) {
    if(this.firstClick){
      this.firstClick = false;      
      this.timerService.startTimer();
    }
    switch (tile.tileState) {
      case tile.states.hidden:
          if(tile.mined){
            this.gameOver();
            return;
          }
          this.board.digRecurs(tile);
          this.checkWinCondition();
        break;
      case tile.states.flagged:
        console.log("there is a flag");
        break;
    }
  }

  onRightClick(tile: TilesComponent){
    if(tile.tileState === tile.states.hidden){
      if(this.flagCount > 0){
        tile.setFlag();
        --this.flagCount;
      } else {
        console.log('vous n\'avez plus de drapeau');
      }
    } else {
      if(this.flagCount <= 10){
        tile.setFlag();
        ++this.flagCount;
      }
      tile.setHidden();
    }
  }

  
  resetGame(): void{
    this.timerService.resetTimer();
    //this.timerService = new TimerService();
    this.firstClick = true;
    this.board.initBoard();
    this.flagCount = this.difficultiesConfig[this.Number(this.selectedDifficulty)].mineCount;
    this.winState = '';
  }

  checkWinCondition(): void{
    let missing = this.board.notMinedTiles.filter(tile => this.board.emptyTiles.indexOf(tile) < 0);    
    if(missing.length === 0){
      this.timerService.stopTimer();
      this.winState = 'win';
    }
  }

  gameOver(): void {
    this.timerService.stopTimer();
    this.board.minedTiles.forEach(minedTile => {
      minedTile.setMine();
      this.winState = 'loose';
    })
  }
  
  contextMenu(e:any){
    e.preventDefault();
  }
}
