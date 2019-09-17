import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrdersService} from "../shared/services/orders.service";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip', null) tooltipRef: ElementRef;
  oSub: Subscription;
  loading = false;
  reloading = false;
  tooltip: MaterialInstance;
  isFilterVisible = false;
  orders: Order[] = [];
  noMoreOrders = false;
  offset = 0;
  limit = STEP;
  filter: Filter = {};

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.reloading = true;
    this.fetch()
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    this.oSub = this.ordersService.fetch(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
        this.loading = false;
        this.reloading = false;
      }
    )
  }

  loadMore() {
    this.offset += STEP;
    this.loading = true;
    this.fetch()
  }

  applyFilter(filter: Filter) {
    this.filter = filter;
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.fetch()
  }

  isFiltered(): boolean {
    return !!Object.keys(this.filter).length
  }
}
