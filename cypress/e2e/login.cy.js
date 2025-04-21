describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login')
  })

  it('should login successfully with valid credentials', () => {
    cy.get('input').eq(0).type('test@mail.com')
    cy.get('input').eq(1).type('mockTestPassword')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
  })

  it('should show an error for invalid credentials', () => {
    cy.get('input').eq(0).type('wronguser@example.com')
    cy.get('input').eq(1).type('wrongpassword')
    cy.get('button[type="submit"]').click()

    cy.contains('Email y/o contraseña inválidos.').should('be.visible')
  })
})
