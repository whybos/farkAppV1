import { Component, OnInit, inject } from '@angular/core';
import { BlogService } from '../../services/blog-service';
import { BlogModel } from '../../model/blog.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.html',
  styleUrls: ['./blog.css'],
})
export class Blog implements OnInit {
  readonly blogService = inject(BlogService);
  blog: BlogModel[] = [];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.blogService.getBlog().subscribe(
      (resp) => {
        console.log('Gelen veri:', resp);

        if (resp.success && Array.isArray(resp.data)) {
          // En büyük ID’li haberi bul
          this.blog = [...resp.data].sort((a, b) => b.id - a.id);
        }
      },
      (err) => {
        console.error('Veri çekme hatası:', err);
      }
    );
  }
}
