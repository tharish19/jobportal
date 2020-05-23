using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using rest_api_jobs.Models;
using Newtonsoft.Json;
using rest_api_jobs.Converters;
using System.Web;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using rest_api_jobs.Extensions;
using rest_api_jobs.Business;
using rest_api_jobs.Repository;

namespace rest_api_jobs
{

    public class Startup
    {

        public Startup(IConfiguration env)
        {
            var builder = new ConfigurationBuilder()

               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)

               .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            /* services.AddCors(options =>
            {
               
                options.AddPolicy("AllowMyOrigin",
                builder => builder.WithOrigins("http://localhost:4200")
               );
                
            });*/
            services.AddControllers().AddJsonOptions(options =>
                options.JsonSerializerOptions.Converters.Add(new IntToStringConverter()));
            // Add framework services.  

            services.AddMvc();
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            // for MSAL (V2)
            //.AddAzureAdBearerV2(options => Configuration.Bind("AzureAd", options));
            // for ADAL (V1)
            .AddAzureAdBearer(options => Configuration.Bind("AzureAd", options));

            services.AddLogging();
            services.AddCors(setup =>
            {
                setup.DefaultPolicyName = "open";
                setup.AddDefaultPolicy(p =>
                {
                    p.AllowAnyHeader();
                    p.AllowAnyMethod();
                    p.WithOrigins("http://localhost:4200");
                    p.AllowCredentials();
                });
            });

            services.Add(new ServiceDescriptor(typeof(Jobsdata), new Jobsdata(Configuration.GetConnectionString("DefaultConnection"))));
            services.AddScoped<IUserBusiness, UserBusiness>();
            services.AddScoped<IUserRepository>(p => new UserRepository(Configuration.GetConnectionString("DefaultConnection")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors("open");
            app.UseAuthentication();
            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
