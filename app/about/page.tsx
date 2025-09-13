export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="container-max section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">About DopeCuts</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Established in 2014, DopeCuts has been the premier destination for men's grooming in the city.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                What started as a small neighborhood barbershop has grown into the city's most trusted 
                destination for premium men's grooming. Our founder, Marcus Johnson, began cutting hair 
                at age 16 and has dedicated his life to perfecting the art of barbering.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Today, our team of master barbers combines traditional techniques with modern styling 
                to deliver exceptional results. We believe every client deserves personalized attention 
                and a grooming experience that exceeds expectations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                At DopeCuts, we're not just cutting hair – we're crafting confidence, one cut at a time.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300">
                  To provide exceptional grooming services that enhance our clients' confidence 
                  and style while creating a welcoming community space.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Excellence in every cut</li>
                  <li>• Respect for traditional craftsmanship</li>
                  <li>• Innovation in modern techniques</li>
                  <li>• Building lasting relationships</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Meet Our Barbers</h2>
            <p className="text-gray-300 mb-12">Skilled professionals dedicated to your style</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Le Roy', role: 'Master Barber & Owner', experience: '15+ years' },
                { name: 'Chuks Pro', role: 'Senior Barber', experience: '8+ years' },
                { name: 'Gabriel Taylor', role: 'Barber Stylist', experience: '5+ years' }
              ].map((barber, index) => (
                <div key={index} className="text-center">
                  <div className="w-48 h-48 bg-gray-700 rounded-lg mx-auto mb-4">
                    <img
                      src={`https://images.pexels.com/photos/${1319460 + index}/pexels-photo-${1319460 + index}.jpeg?auto=compress&cs=tinysrgb&w=400`}
                      alt={barber.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{barber.name}</h3>
                  <p className="text-gray-300 mb-1">{barber.role}</p>
                  <p className="text-sm text-gray-400">{barber.experience}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}