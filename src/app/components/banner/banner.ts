import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner implements AfterViewInit, OnDestroy {
  private carouselElement: HTMLElement | null = null;
  private carouselInstance: Carousel | null = null;
  private slideTimeout: any;

  ngAfterViewInit() {
    this.carouselElement = document.getElementById('carouselExampleIndicators');

    if (this.carouselElement) {
      this.carouselInstance = new Carousel(this.carouselElement, {
        interval: false,
        ride: false,
        wrap: true,
      });

      this.setupCarouselEvents();
    }
  }

  ngOnDestroy(): void {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }
  }

  private setupCarouselEvents(): void {
    if (!this.carouselElement || !this.carouselInstance) return;

    this.carouselElement.addEventListener('slid.bs.carousel', () => {
      this.startSlideTimer();
    });

    // 1. Ouvinte para tentar iniciar o ciclo após QUALQUER clique do usuário no carrossel.
    this.carouselElement.addEventListener(
      'click',
      () => {
        this.startSlideTimer();
      },
      { once: true }
    ); // Executa apenas na primeira vez

    // 2. Tenta iniciar o primeiro slide imediatamente.
    this.startSlideTimer();
  }

  private startSlideTimer(): void {
    if (this.slideTimeout) {
      clearTimeout(this.slideTimeout);
    }

    const activeSlide = this.carouselElement!.querySelector('.carousel-item.active');
    const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

    if (activeVideo) {
      // Tenta tocar o vídeo. Isso só funcionará se houver interação.
      activeVideo.play().catch((error) => {
        // Captura o erro, mas o timer de avanço continua.
      });

      // Pausa e reseta os outros vídeos (boa prática)
      this.carouselElement!.querySelectorAll('video').forEach((video) => {
        if (video !== activeVideo) {
          video.pause();
          video.currentTime = 0;
        }
      });
    }

    // 3. Define o timer para forçar o avanço após 5000ms (5 segundos).
    this.slideTimeout = setTimeout(() => {
      this.carouselInstance!.next();
    }, 5000);
  }
}
