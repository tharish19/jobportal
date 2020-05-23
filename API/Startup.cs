using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using rest_api_jobs.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using rest_api_jobs.Extensions;
using rest_api_jobs.Business;
using rest_api_jobs.Repository;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace rest_api_jobs
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder =>
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());

                options.AddPolicy("DomainSpecificPolicy",
                    builder =>
                        builder.WithOrigins(Configuration["CorsOrigins"].Split(","))
                                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                                        .AllowAnyMethod()
                                        .AllowAnyHeader());
            });

            //Reducing the size of the response to increases the responsiveness of the app
            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Optimal;
            });

            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });

            // Add framework services.  
            services.AddMvc();
            services.AddControllers().AddNewtonsoftJson();

            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            // for MSAL (V2)
            //.AddAzureAdBearerV2(options => Configuration.Bind("AzureAd", options));
            // for ADAL (V1)
            .AddAzureAdBearer(options => Configuration.Bind("AzureAd", options));

            services.AddLogging();

            services.AddScoped<IUserBusiness, UserBusiness>();
            services.AddScoped<IUserRepository>(p => new UserRepository(Configuration.GetConnectionString("DefaultConnection")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseCors("AllowAll");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseCors("DomainSpecificPolicy");
                app.UseHsts();
            }
            app.UseAuthentication();
            
            //Response Caching Compression
            app.UseResponseCompression();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
