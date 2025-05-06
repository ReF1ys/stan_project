import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Middleware executed:', req.nextUrl.pathname);
  
  // Можно добавить логику (например, редирект неавторизованных пользователей)
  
  return NextResponse.next(); // Пропускает запрос дальше
}

// Опционально, если нужна фильтрация маршрутов
export const config = {
  matcher: '/api/:path*', // Применять только к API-роутам
};
