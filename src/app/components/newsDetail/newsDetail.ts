import { Component, inject, OnInit } from '@angular/core';
import { newsDetailService } from '../../services/newsDetail-service';
import { ActivatedRoute } from '@angular/router';
import { newsDetailModel } from '../../model/newsDetail.model';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './newsDetail.html',
  styleUrl: './newsDetail.css',
})
export class NewsDetail implements OnInit {
  readonly detailService = inject(newsDetailService);
  detail: newsDetailModel = {};

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.getData(+id);
      }
    });
  }

  getData(id: number) {
    this.detailService.getDetail(id).subscribe((resp) => {
      console.log(resp);
      this.detail = resp.data;
    });
  }
}
