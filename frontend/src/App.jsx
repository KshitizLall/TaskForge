import { Signup } from "./screen/Signup";

export default function App() {
  return (
    <>
      <Signup />
    </>
  );
}

// import React from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Navbar from "./components/Navbar";

// const Home = () => <h1>Home Page</h1>;
// const About = () => <h1>About Page</h1>;

// export default function App() {
//   return (
//     <Router>
//       <div>
//         <Navbar />
//         <Switch>
//           <Route path="/" exact component={Home} />
//           <Route path="/about" component={About} />
//         </Switch>
//       </div>
//     </Router>
//   );
// }
