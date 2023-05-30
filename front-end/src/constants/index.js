import { facebook, instagram, linkedin, twitter } from "../assets";


/**
 * Array holding all links in navigation bar
 */
export const navLinks = [
  {
    id: "help",
    title: "Help",
    link: "/Help",
  },
];

/**
 * The questions in Help.jsx/help page.
 */
export const features = [
  {
    id: "feature-1",
    title: "When was this application built?",
    content:
      "This application was built in 2023 as part of our module, Software Engineering Group Project.",
  },
  {
    id: "feature-2",
    title: "Who are the team members involved in the development of this application?",
    content:
      "Our team consists of 5 Computer Science students from the University of Nottingham Malaysia, supervised by Mr Chew Sze Ker.",
  },
  {
    id: "feature-3",
    title: "What concept does the Imag.e system use to detect and recognise faces?",
    content:
      "The system uses Histogram of Oriented Gradients to extract the features of the individual found in the image uploaded by user.",
  },
  {
    id: "feature-4",
    title: "How to use this Imag.e application to detect faces?",
    content:
      "Navigate to the function page by clicking the 'Get Started' button. Upload an image of only 1 individual.",
  },
];

/**
 * All links for items listed in footer.
 */
export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Reference",
        link: "https://www.youtube.com/@javascriptmastery",
      },
      {
        name: "How it Works",
        link: "/Help",
      },
      {
        name: "Explore",
        link: "/Help",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.nottingham.edu.my/Study/Make-an-enquiry/Contact-us.aspx",
      },
      {
        name: "University",
        link: "https://www.nottingham.edu.my/",
      },
      {
        name: "Newsletters",
        link: "https://www.nottingham.edu.my/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.nottingham.edu.my/",
      },
      {
        name: "Our Supervisor",
        link: "https://www.nottingham.edu.my/Science/People/chew.sze-ker",
      },
    ],
  },
];

/**
 * Here are the links for social media icons at the bottom of the page.
 */
export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];

