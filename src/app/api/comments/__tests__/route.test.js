// Configurar variáveis de ambiente ANTES de qualquer import
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

// Mock de funções Supabase
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockInsert = jest.fn();
const mockSingle = jest.fn();
const mockFrom = jest.fn();

const mockSupabaseClient = {
  from: mockFrom,
};

// Mock do createClient do Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// Mock do NextResponse
const mockNextResponseJson = jest.fn((data, options) => ({
  status: options?.status || 200,
  data,
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: mockNextResponseJson,
  },
}));

// Importar o módulo após os mocks
const { GET, POST } = require('../route');

describe('Comments API Route - Testes Unitários com Mocks', () => {
  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Configurar comportamento padrão dos mocks
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ order: mockOrder, single: mockSingle });
    mockOrder.mockReturnValue({ data: [], error: null });
    mockSingle.mockResolvedValue({ data: null, error: null });

    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({ single: mockSingle }),
    });

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });
  });

  describe('GET /api/comments', () => {
    it('deve retornar erro 400 quando identifier não for fornecido', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/comments',
      };

      await GET(mockRequest);

      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'identifier é obrigatório' },
        { status: 400 }
      );
    });

    it('deve buscar comentários com sucesso', async () => {
      const mockComments = [
        {
          id: 1,
          content: 'Ótimo anime!',
          created_at: '2025-01-08T10:00:00Z',
          username: 'user1',
          avatar_url: 'https://example.com/avatar1.png',
          parent_id: null,
          profiles: {
            username: 'user1',
            avatar_url: 'https://example.com/avatar1.png',
          },
        },
      ];

      mockOrder.mockReturnValue({
        data: mockComments,
        error: null,
      });

      const mockRequest = {
        url: 'http://localhost:3000/api/comments?identifier=anime-123',
      };

      await GET(mockRequest);

      expect(mockFrom).toHaveBeenCalledWith('comments');
      expect(mockSelect).toHaveBeenCalledWith(
        'id, content, created_at, username, avatar_url, parent_id, profiles(username, avatar_url)'
      );
      expect(mockEq).toHaveBeenCalledWith('identifier', 'anime-123');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });

      expect(mockNextResponseJson).toHaveBeenCalledWith([
        {
          id: 1,
          content: 'Ótimo anime!',
          created_at: '2025-01-08T10:00:00Z',
          username: 'user1',
          avatar_url: 'https://example.com/avatar1.png',
          parent_id: null,
        },
      ]);
    });

    it('deve lidar com erro de coluna ausente (código 42703)', async () => {
      const mockCommentsWithoutProfiles = [
        {
          id: 1,
          content: 'Comentário sem join',
          created_at: '2025-01-08T10:00:00Z',
          username: 'user1',
          avatar_url: 'https://example.com/avatar1.png',
          parent_id: null,
        },
      ];

      mockOrder
        .mockReturnValueOnce({
          data: null,
          error: { code: '42703', message: 'column does not exist' },
        })
        .mockReturnValueOnce({
          data: mockCommentsWithoutProfiles,
          error: null,
        });

      const mockRequest = {
        url: 'http://localhost:3000/api/comments?identifier=anime-123',
      };

      await GET(mockRequest);

      // Deve tentar duas vezes
      expect(mockSelect).toHaveBeenCalledTimes(2);

      // Segunda tentativa sem o join
      expect(mockSelect).toHaveBeenLastCalledWith(
        'id, username, avatar_url, content, created_at, parent_id'
      );

      expect(mockNextResponseJson).toHaveBeenCalledWith([
        {
          id: 1,
          content: 'Comentário sem join',
          created_at: '2025-01-08T10:00:00Z',
          username: 'user1',
          avatar_url: 'https://example.com/avatar1.png',
          parent_id: null,
        },
      ]);
    });

    it('deve retornar erro 500 quando houver erro no banco de dados', async () => {
      mockOrder.mockReturnValue({
        data: null,
        error: { code: 'DATABASE_ERROR', message: 'Connection failed' },
      });

      const mockRequest = {
        url: 'http://localhost:3000/api/comments?identifier=anime-123',
      };

      await GET(mockRequest);

      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Erro ao buscar comentários' },
        { status: 500 }
      );
    });
  });

  describe('POST /api/comments', () => {
    it('deve retornar erro 400 quando faltar identifier', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          content: 'Comentário sem identifier',
        }),
      };

      await POST(mockRequest);

      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    });

    it('deve retornar erro 400 quando faltar content', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          identifier: 'anime-123',
        }),
      };

      await POST(mockRequest);

      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    });

    it('deve criar comentário com sucesso', async () => {
      const mockNewComment = {
        id: 3,
        content: 'Novo comentário!',
        created_at: '2025-01-08T12:00:00Z',
        username: 'user3',
        avatar_url: 'https://example.com/avatar3.png',
        parent_id: null,
        profiles: {
          username: 'user3',
          avatar_url: 'https://example.com/avatar3.png',
        },
      };

      mockSingle.mockResolvedValue({
        data: mockNewComment,
        error: null,
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          identifier: 'anime-123',
          content: 'Novo comentário!',
          profile_id: 'profile-123',
          username: 'user3',
          avatar_url: 'https://example.com/avatar3.png',
          parent_id: null,
        }),
      };

      await POST(mockRequest);

      expect(mockFrom).toHaveBeenCalledWith('comments');
      expect(mockInsert).toHaveBeenCalledWith({
        identifier: 'anime-123',
        profile_id: 'profile-123',
        username: 'user3',
        avatar_url: 'https://example.com/avatar3.png',
        content: 'Novo comentário!',
        parent_id: null,
      });

      expect(mockNextResponseJson).toHaveBeenCalledWith({
        id: 3,
        content: 'Novo comentário!',
        created_at: '2025-01-08T12:00:00Z',
        username: 'user3',
        avatar_url: 'https://example.com/avatar3.png',
        parent_id: null,
      });
    });

    it('deve criar comentário como resposta (com parent_id)', async () => {
      const mockReply = {
        id: 4,
        content: 'Resposta',
        created_at: '2025-01-08T13:00:00Z',
        username: 'user4',
        avatar_url: 'https://example.com/avatar4.png',
        parent_id: 1,
        profiles: {
          username: 'user4',
          avatar_url: 'https://example.com/avatar4.png',
        },
      };

      mockSingle.mockResolvedValue({
        data: mockReply,
        error: null,
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          identifier: 'anime-123',
          content: 'Resposta',
          username: 'user4',
          avatar_url: 'https://example.com/avatar4.png',
          parent_id: 1,
        }),
      };

      await POST(mockRequest);

      const result = mockNextResponseJson.mock.calls[0][0];
      expect(result.parent_id).toBe(1);
    });

    it('deve lidar com erro PGRST204 e tentar novamente', async () => {
      const mockCommentWithoutProfile = {
        id: 5,
        content: 'Comentário',
        created_at: '2025-01-08T14:00:00Z',
        username: 'user5',
        avatar_url: 'https://example.com/avatar5.png',
        parent_id: null,
      };

      mockSingle
        .mockResolvedValueOnce({
          data: null,
          error: { code: 'PGRST204', message: 'No Content' },
        })
        .mockResolvedValueOnce({
          data: mockCommentWithoutProfile,
          error: null,
        });

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          identifier: 'anime-123',
          content: 'Comentário',
          profile_id: 'profile-789',
          username: 'user5',
          avatar_url: 'https://example.com/avatar5.png',
          parent_id: null,
        }),
      };

      await POST(mockRequest);

      // Deve tentar inserir duas vezes
      expect(mockInsert).toHaveBeenCalledTimes(2);

      // Segunda tentativa sem profile_id
      expect(mockInsert).toHaveBeenLastCalledWith({
        identifier: 'anime-123',
        username: 'user5',
        avatar_url: 'https://example.com/avatar5.png',
        content: 'Comentário',
        parent_id: null,
      });

      expect(mockNextResponseJson).toHaveBeenCalledWith({
        id: 5,
        content: 'Comentário',
        created_at: '2025-01-08T14:00:00Z',
        username: 'user5',
        avatar_url: 'https://example.com/avatar5.png',
        parent_id: null,
      });
    });

    it('deve retornar erro 500 quando houver erro ao inserir', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'INSERT_ERROR', message: 'Failed to insert' },
      });

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          identifier: 'anime-123',
          content: 'Comentário com erro',
          username: 'user6',
        }),
      };

      await POST(mockRequest);

      expect(mockNextResponseJson).toHaveBeenCalledWith(
        { error: 'Erro ao inserir comentário' },
        { status: 500 }
      );
    });
  });
});
