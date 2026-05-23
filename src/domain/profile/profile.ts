export interface Social {
  linkedin: string;
  github: string;
  medium: string;
  whatsapp: string;
}

export interface Profile {
  name: string;
  photo: string;
  email: string;
  social: Social;
}

export const profile: Profile = {
  name: 'Johnson Mauro',
  photo: 'assets/img/JohnsonMauro.png',
  email: 'johnsonmauro@gmail.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/johnsonmauro',
    github: 'https://github.com/JohnsonMauro',
    medium: 'https://medium.com/@johnsonmauro',
    whatsapp: '+5581988146287',
  },
};
