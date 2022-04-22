import {AfterContentInit, Component} from '@angular/core';
import {
  D3DragEvent,
  drag,
  rgb,
  scaleOrdinal,
  schemeCategory10, select, Selection
} from 'd3';
import {NodeModel} from "./model/node.model";
import {Store} from "@ngrx/store";
import {updateNodes} from "./store/app.actions";
import {LinkModel} from "./model/link.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  title = 'bac_project';

  width = 960;
  height = 600;
  svg!: Selection<any, any, any, any>;
  force: any;
  path: any;
  circle!: Selection<any, any, any, any>;
  drag: any;
  dragLine: any;

  colors = scaleOrdinal(schemeCategory10);

  selectedNode = null;
  selectedLink = null;

  mousedownNode: any;
  mouseupNode: any;

  dblClickFirstNode: NodeModel | undefined;
  dblClickSecondNode: NodeModel | undefined;

  nodes: NodeModel[] = [
    {id: 0, x: 500, y: 100},
    {id: 1, x: 200, y: 350},
    {id: 2, x: 300, y: 300},
    {id: 3, x: 500, y: 300}
  ];
  links: LinkModel[] = [
    {source: this.nodes[0], target: this.nodes[1], left: false, right: true},
    {source: this.nodes[1], target: this.nodes[2], left: false, right: true},
    {source: this.nodes[0], target: this.nodes[3], left: false, right: true}
  ];


  constructor(private store: Store) {
  }

  ngAfterContentInit() {
    this.svg = select('#graphContainer')
      .attr('oncontextmenu', 'return false;')
      .attr('width', this.width)
      .attr('height', this.height);

    this.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

    this.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');

    this.dragLine = this.svg.append('svg:path')
      .attr('class', 'link dragline hidden')
      .attr('d', 'M0,0L0,0');

    this.path = this.svg.append('svg:g').selectAll('path');
    this.circle = this.svg.append('svg:g').selectAll('g');


    this.restart()

  }

  restart() {
    // path (link) group
    this.path = this.path.data(this.links);

    // update existing links
    this.path.classed('selected', (d: any) => d === this.selectedLink)
      .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '');

    // remove old links
    this.path.exit().remove();

    // add new links
    this.path = this.path.enter().append('svg:path')
      .attr('class', 'link')
      .classed('selected', (d: any) => d === this.selectedLink)
      .style('marker-start', (d: any) => d.left ? 'url(#start-arrow)' : '')
      .style('marker-end', (d: any) => d.right ? 'url(#end-arrow)' : '')
      .merge(this.path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    this.circle = this.circle.data<NodeModel>(this.nodes, (d: any) => d.id);

    // update existing nodes (reflexive & selected visual states)
    this.circle.selectAll('circle')
      .style('fill', (d: any) => (d === this.selectedNode) ? rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .classed('reflexive', (d: any) => d.reflexive);

    // remove old nodes
    this.circle.exit().remove();

    // add new nodes
    const g = this.circle.enter().append('svg:g').attr('transform', (d: NodeModel) => `translate(${d.x},${d.y})`);


    g.append('svg:circle')
      .attr('class', 'node')
      .attr('r', 12)
      .style('fill', (d: any) => (d === this.selectedNode) ? rgb(this.colors(d.id)).brighter().toString() : this.colors(d.id))
      .style('stroke', (d: any) => rgb(this.colors(d.id)).darker().toString())
      .on('dblclick', (event, d: NodeModel) => {
        if(!this.dblClickFirstNode){
          this.dblClickFirstNode = d;
        }else {
          this.dblClickSecondNode = d;
        }
        if(this.dblClickFirstNode && this.dblClickSecondNode && this.dblClickFirstNode !== this.dblClickSecondNode){
          this.links.push({ source: this.dblClickFirstNode , target: this.dblClickSecondNode, left: false, right: true });
          this.dblClickFirstNode = undefined;
          this.dblClickSecondNode = undefined;
          console.log(this.nodes)
          console.log(this.links)
          this.restart()
        }
      });

    // show node IDs
    g.append('svg:text')
      .attr('x', -3)
      .attr('y', 4)
      .attr('class', 'id')
      .text((d: any) => d.id);

    this.circle = g.merge(this.circle);

    this.circle.call(drag()
      .on('start', this.dragStart)
      .on('drag', (event, d: any) => {
        d.x = event.x;
        d.y = event.y;
        this.restart()
      })
      .on('end', this.dragEnd)
    );


    this.tick();

    this.store.dispatch(updateNodes({nodes: this.nodes.map(node => ({...node}))}));
  }

  resetMouseVars() {
    this.mousedownNode = null;
    this.mouseupNode = null;
  }

  tick() {
    // draw directed edges with proper padding from node centers
    this.path.attr('d', (d: any) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = d.left ? 17 : 12;
      const targetPadding = d.right ? 17 : 12;
      const sourceX = d.source.x + (sourcePadding * normX);
      const sourceY = d.source.y + (sourcePadding * normY);
      const targetX = d.target.x - (targetPadding * normX);
      const targetY = d.target.y - (targetPadding * normY);

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });
    this.circle.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  dragStart() {


  }

  dragging(event: D3DragEvent<any, any, any>, d: NodeModel) {
    d.x = event.x;
    d.y = event.y;
  }

  dragEnd() {

  }

  addNewNode() {
    this.nodes.push({id: 7, x: 400, y: 400});
    this.restart();
  }

}
