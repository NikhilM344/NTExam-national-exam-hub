import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Target, Heart, Star } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="relative py-12 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shadow-soft">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
            Fostering Academic Excellence and Unlocking Student Potential
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-card p-8 space-y-8">
            
            {/* Introduction */}
            <div className="text-center mb-12">
              <p className="text-muted-foreground text-lg leading-relaxed">
                The Navoday Talent Exam is a flagship educational initiative organized by Prerana Education Trust, 
                an institution committed to fostering academic excellence and unlocking the potential of young minds. 
                Established in January 2017, the Trust has been working tirelessly to create opportunities for students 
                to showcase their talents, gain recognition, and pursue their educational dreams.
              </p>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-center">
                Our mission is to identify, encourage, and nurture the hidden potential of students across various academic levels. 
                Through the Navoday Talent Exam, we aim to inspire curiosity, healthy competition, and a passion for learning, 
                empowering students to excel not just in academics but in life.
              </p>
            </div>

            {/* Story */}
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Over the years, we have built a reputation for fair, transparent, and merit-based assessments that celebrate 
                the skills and capabilities of students from diverse backgrounds. The exam serves as a platform for recognizing 
                brilliance and providing deserving students with scholarships, guidance, and motivation to reach higher milestones.
              </p>
            </div>

            {/* Objectives */}
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                <Target className="h-8 w-8 mr-3 text-primary" />
                Our Objectives
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-secondary flex-shrink-0" />
                  To recognize and reward academic talent at the school level.
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-secondary flex-shrink-0" />
                  To encourage students to develop problem-solving, reasoning, and critical-thinking skills.
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-secondary flex-shrink-0" />
                  To provide scholarships, awards, and guidance to deserving students.
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 mr-3 mt-1 text-secondary flex-shrink-0" />
                  To create a competitive yet supportive learning environment.
                </li>
              </ul>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-primary/10 rounded-xl p-6 border border-primary/20">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-primary" />
                  Our Values
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Integrity</h4>
                    <p className="text-muted-foreground text-sm">Upholding fairness and transparency in all processes.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Excellence</h4>
                    <p className="text-muted-foreground text-sm">Striving for the highest standards in education and organization.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-secondary/10 rounded-xl p-6 border border-secondary/20">
                <h3 className="text-xl font-bold text-foreground mb-3 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-secondary" />
                  Our Impact
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Opportunity</h4>
                    <p className="text-muted-foreground text-sm">Creating equal chances for every student to shine.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Inspiration</h4>
                    <p className="text-muted-foreground text-sm">Motivating students to dream big and achieve more.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Story */}
            <div className="bg-gradient-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Our Journey</h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-center">
                Since our inception, the Navoday Talent Exam has grown to reach students across multiple regions, making a positive 
                impact on thousands of young learners and contributing to the vision of a brighter, more knowledgeable generation.
              </p>
            </div>

            {/* Future Vision */}
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Looking Forward</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Prerana Education Trust will continue its journey of uplifting education, nurturing talent, and empowering 
                future leaders of our nation. We remain committed to our vision of creating equal opportunities for every 
                student to showcase their potential and achieve academic excellence.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Navoday Talent Exam</strong></p>
                <p><strong>Email:</strong> nteexam@gmail.com</p>
                <p><strong>Phone:</strong> +919426060635</p>
                <p><strong>Address:</strong> 305, 3rd Floor, Flamingo, Sargasan, Gandhinagar, Gujarat-382421</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;