# Book Marker

An app for Book management using HTML, CSS & TS

Author: Hoang Le Minh Tran &lt;[hoang.tranle@asnet.com.vn](hoang.tranle@asnet.com.vn)&gt;

Design: [Figma](https://www.figma.com/file/csmgT3kp1rqDqO5IkZnq5A/Book-Marker-v1---Javascript-practice?type=design&node-id=0%3A1&mode=design&t=lPRsjx4Onkxi2q72-1)

## Tech Stacks

The project is built using the following technologies:

- HTML5: The standard markup language for creating web pages.
- CSS3: The style sheet language used for styling the HTML elements.
- Typescript : A lightweight interpreted (or just-in-time compiled) programming language with first-class functions.

## Development Tools

These tools are used to facilitate development and testing:

- Parcel (v2.12.0): A blazing fast, zero-configuration web application bundler that enables easy setup and development of the project.
- JSON server (v0.17.4): A library for getting a full fake REST API with zero coding.

## Requirements

- [Node](https://nodejs.org/en/) &gt;= 20.12.2 / [npm](https://www.npmjs.com/) &gt;= 7.7.6
- [Parcel](https://parceljs.org/) &gt;= 2.0.1
- [pnpm](https://pnpm.io/) &gt;= 8.7.0

## Getting Started

Step by step to run this app in your local

1. Clone the project repository:

- Using https

  ```
  git clone git@gitlab.asoft-python.com:hoang.tranle/javascript-training.git`
  ```

- Using ssh

  ```
  git clone git@gitlab.asoft-python.com:hoang.tranle/javascript-training.git`
  ```

2. Install project dependencies

- Make sure that you stand in the root directory.
- Move to project folder

  ```
  cd practices/practice-two
  ```

- Install dependencies

  ```
  pnpm install
  ```

3. Create an .env file

- In the root directory, create a file call **.env.development** and insert the url below into it.

  ```
  BASE_API_URL=http://localhost:3000
  ```

- Please contact the authors to get some secrets key below
  ```
  IMAGE_UPLOAD_URL
  IMAGE_UPLOAD_KEY
  ```

4. Running the server

- Open a new termial
- Move to server folder

  ```
  cd server
  ```

- Run the server
  ```
  pnpm start-server
  ```
- The server will run on [http://localhost:3000](http://localhost:3000) by default. You can access it using your browser.

5. Running the page

- Open a new terminal
- Make sure that you stand in the **practice-two** folder.
- Run the page
  ```
  pnpm start
  ```
- The page will run on [http://localhost:1234](http://localhost:1234) by default. You can access it using your browser.
