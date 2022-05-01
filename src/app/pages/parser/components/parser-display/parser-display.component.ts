import { Component, OnInit } from '@angular/core';
import {ParserService} from "../../service/parser.service";

@Component({
  selector: 'app-parser-display',
  templateUrl: './parser-display.component.html',
  styleUrls: ['./parser-display.component.scss']
})
export class ParserDisplayComponent implements OnInit {

  public parsingInput: string = '';
  public valid: boolean = false;

  constructor(private parsingService: ParserService) { }

  ngOnInit(): void {
  }

  sendTheNewValue(input: string){
    this.parsingInput = input;
    this.valid = this.parsingService.parseString(input);
  }

}
