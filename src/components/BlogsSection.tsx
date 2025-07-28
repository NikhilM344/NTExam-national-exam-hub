import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const BlogsSection = () => {
  const blogs = [
    {
      id: 1,
      title: "Top 10 Study Tips for Competitive Exams",
      excerpt: "Discover proven strategies that help students excel in competitive exams. Learn effective study techniques used by toppers.",
      author: "Dr. Priya Sharma",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Study Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "How to Overcome Exam Anxiety and Stress",
      excerpt: "Learn practical methods to manage exam stress and perform your best under pressure. Mental health tips for students.",
      author: "Dr. Rajesh Kumar",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Mental Health",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Mathematics Made Easy: Problem-Solving Techniques",
      excerpt: "Master complex mathematical concepts with simple tricks and techniques. Step-by-step approach to solve difficult problems.",
      author: "Prof. Anita Gupta",
      date: "March 10, 2024",
      readTime: "8 min read",
      category: "Mathematics",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "Science Experiments You Can Do at Home",
      excerpt: "Fun and educational science experiments to boost your understanding. Perfect for curious minds and practical learning.",
      author: "Dr. Vikash Singh",
      date: "March 8, 2024",
      readTime: "6 min read",
      category: "Science",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "English Grammar: Common Mistakes to Avoid",
      excerpt: "Improve your English language skills by learning about the most common grammatical errors students make.",
      author: "Ms. Sneha Reddy",
      date: "March 5, 2024",
      readTime: "4 min read",
      category: "English",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Time Management Strategies for Students",
      excerpt: "Learn how to balance studies, extracurricular activities, and personal time effectively. Create your perfect schedule.",
      author: "Dr. Aman Patel",
      date: "March 3, 2024",
      readTime: "5 min read",
      category: "Productivity",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=250&fit=crop",
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Study Tips": "bg-blue-100 text-blue-800",
      "Mental Health": "bg-green-100 text-green-800",
      "Mathematics": "bg-purple-100 text-purple-800",
      "Science": "bg-orange-100 text-orange-800",
      "English": "bg-pink-100 text-pink-800",
      "Productivity": "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Latest Blogs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest educational content, study tips, and exam strategies 
            written by our expert educators and successful students.
          </p>
        </div>

        {/* Featured Blog */}
        {blogs[0] && (
          <Card className="mb-12 shadow-winner hover:shadow-2xl transition-all duration-500 bg-gradient-card border-0 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Featured Image */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={blogs[0].image} 
                  alt={blogs[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-warning text-warning-foreground font-semibold">
                    Featured
                  </Badge>
                </div>
              </div>

              {/* Featured Content */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <Badge className={getCategoryColor(blogs[0].category)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {blogs[0].category}
                  </Badge>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                    {blogs[0].title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {blogs[0].excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {blogs[0].author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {blogs[0].date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {blogs[0].readTime}
                    </div>
                  </div>

                  <Button className="w-fit bg-gradient-primary hover:opacity-90 text-primary-foreground">
                    Read Full Article
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Regular Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.slice(1).map((blog) => (
            <Card 
              key={blog.id}
              className="shadow-card hover:shadow-winner transition-all duration-500 hover:scale-105 bg-gradient-card border-0 overflow-hidden group"
            >
              {/* Blog Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(blog.category)}>
                    <Tag className="h-3 w-3 mr-1" />
                    {blog.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {blog.title}
                </h3>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="w-full space-y-3">
                  {/* Author and Date */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {blog.date}
                    </div>
                  </div>

                  {/* Read Time and Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {blog.readTime}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary-hover p-0 h-auto font-medium"
                    >
                      Read More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="text-center mt-10">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
          >
            View All Blog Posts
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;