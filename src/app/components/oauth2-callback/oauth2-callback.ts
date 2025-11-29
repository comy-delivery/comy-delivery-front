import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth-service';

@Component({
    selector: 'app-oauth2-callback',
    template: `
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Processando login...</span>
                </div>
                <h4 class="mt-3 text-primary">Autenticando com Google...</h4>
            </div>
        </div>
    `, 
    standalone: true,
    imports: [CommonModule]
})
export class OAuth2Callback implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            const accessToken = params['access_token'];
            const refreshToken = params['refresh_token'];
            const userId = params['user_id'];

            console.log('TOKENS RECEBIDOS:', { accessToken, refreshToken, userId });

            if (accessToken && refreshToken && userId) {
                // Salva no localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('userId', userId);

                console.log('TOKENS SALVOS! Redirecionando para home...');

                // Vai pra home
                this.router.navigate(['/']);
            } else {
                console.error('ERRO: Tokens não vieram!');
                this.router.navigate(['/login']);
            }
        });
    }
}