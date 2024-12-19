/* eslint-disable no-undef */
describe('template spec', () => {
	it('passes', () => {
		cy.visit('/');
	});
});

describe('Form switching', () => {
	beforeEach(() => {
		cy.visit('/'); // open page before each test
	});

	it('should switch to login form when clicking Login', () => {
		cy.get('button').contains('Sign In').click();
		cy.contains('Sign In').should('be.visible');
		cy.contains('Register').should('not.exist');
	});

	it('should switch to register form when clicking Register', () => {
		cy.get('button').contains('Sign In').click();
		cy.get('button').contains('Sign Up').click();
		cy.contains('Register').should('be.visible');
		cy.contains('Login').should('not.exist');
	});
});

describe('Registration form', () => {
	const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
	const randomPassword = `Pass${Math.floor(Math.random() * 100000)}`;

	it('test1 - valid data', () => {
		cy.intercept('POST', 'http://localhost:3000/register').as('registerRequest');
		cy.visit('/');
		cy.contains('Sign Up').should('be.visible');

		cy.get('input[name="email"]').type(randomEmail);
		cy.get('input[name="password"]').type(randomPassword);

		cy.get('button').contains('Register').click();

		cy.intercept('POST', 'http://localhost:3000/register').as('registerRequest');
		cy.wait('@registerRequest').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			expect(interception.response.body.success).to.be.true;
		});
	});

	it('test2 - invalid data', () => {
		cy.intercept('POST', 'http://localhost:3000/register').as('registerRequest');
		cy.visit('/');
		cy.contains('Sign Up').should('be.visible');

		cy.get('input[name="email"]').type('test1@gmail.com');
		cy.get('input[name="password"]').type(randomPassword);

		cy.get('button').contains('Register').click();

		cy.intercept('POST', 'http://localhost:3000/register').as('registerRequest');
		cy.wait('@registerRequest').then(interception => {
			expect(interception.response.statusCode).to.eq(401);
			expect(interception.response.body.success).to.be.false;
		});
	});
});

describe('Login form', () => {
	const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
	const randomPassword = `Pass${Math.floor(Math.random() * 100000)}`;

	it('test1 - valid data', () => {
		cy.intercept('POST', 'http://localhost:3000/login').as('loginRequest');
		cy.visit('/');
		cy.get('button').contains('Sign In').click();
		cy.contains('Sign Up').should('be.visible');

		cy.get('input[name="emailLog"]').type('test1@gmail.com');
		cy.get('input[name="passwordLog"]').type('test1');

		cy.get('button').contains('Login').click();

		cy.intercept('POST', 'http://localhost:3000/login').as('loginRequest');
		cy.wait('@loginRequest').then(interception => {
			expect(interception.response.statusCode).to.eq(200);
			expect(interception.response.body.success).to.be.true;
		});
	});

	it('test2 - invalid data', () => {
		cy.intercept('POST', 'http://localhost:3000/login').as('loginRequest');
		cy.visit('/');
		cy.get('button').contains('Sign In').click();
		cy.contains('Sign Up').should('be.visible');

		cy.get('input[name="emailLog"]').type(randomEmail);
		cy.get('input[name="passwordLog"]').type(randomPassword);

		cy.get('button').contains('Login').click();

		cy.intercept('POST', 'http://localhost:3000/login').as('loginRequest');
		cy.wait('@loginRequest').then(interception => {
			expect(interception.response.statusCode).to.eq(401);
			expect(interception.response.body.success).to.be.false;
		});
	});
});
