import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationAppError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationAppError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} no encontrado`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export type ErrorResponse = {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
};

export function handleError(error: unknown): NextResponse<ErrorResponse> {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const issues = error.issues.map(i => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return NextResponse.json(
      {
        error: 'Error de validación',
        code: 'VALIDATION_ERROR',
        details: { issues },
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

export async function withErrorHandling(
  handler: () => Promise<NextResponse | Response>
): Promise<NextResponse> {
  try {
    const response = await handler();
    if (response instanceof NextResponse) {
      return response;
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}