import { Component, OnInit } from '@angular/core';
import {ParserService} from "../../service/parser.service";

@Component({
  selector: 'app-parser-display',
  templateUrl: './parser-display.component.html',
  styleUrls: ['./parser-display.component.scss']
})
export class ParserDisplayComponent implements OnInit {

  public parsingInputs: string[] = [];
  public valid: boolean = false;

  constructor(private parsingService: ParserService) { }

  ngOnInit(): void {
  }

  sendTheNewValue(input: string){
    this.parsingInputs = input.split('\n');
    // this.valid = this.parsingService.parseString(input);
  }

  parse(input: string): boolean{
    return this.parsingService.parseString(input);
  }

}
