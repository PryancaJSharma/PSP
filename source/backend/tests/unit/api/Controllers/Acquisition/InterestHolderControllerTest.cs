using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using FluentAssertions;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Pims.Api.Areas.Acquisition.Controllers;
using Pims.Api.Areas.Admin.Controllers;
using Pims.Api.Areas.Takes.Controllers;
using Pims.Api.Models.Concepts;
using Pims.Api.Services;
using Pims.Core.Exceptions;
using Pims.Core.Test;
using Pims.Dal.Entities;
using Pims.Dal.Security;
using Xunit;

namespace Pims.Api.Test.Controllers
{
    [Trait("category", "unit")]
    [Trait("category", "api")]
    [Trait("area", "takes")]
    [ExcludeFromCodeCoverage]
    public class InterestHolderControllerTest
    {
        // xUnit.net creates a new instance of the test class for every test that is run,
        // so any code which is placed into the constructor of the test class will be run for every single test.
        private readonly TestHelper _helper;
        private readonly InterestHolderController _controller;
        private readonly Mock<IAcquisitionFileService> _service;
        private readonly IMapper _mapper;

        public InterestHolderControllerTest()
        {
            _helper = new TestHelper();
            _controller = _helper.CreateController<InterestHolderController>(Permissions.AcquisitionFileView);
            _service = _helper.GetService<Mock<IAcquisitionFileService>>();
            _mapper = _helper.GetService<IMapper>();
        }

        [Fact]
        public void GetInterestHolderByAcquisitionFileId_Success()
        {
            // Arrange
            _service.Setup(m => m.GetInterestHolders(It.IsAny<long>()));

            // Act
            var result = _controller.GetAcquisitionFileInterestHolders(1);

            // Assert
            result.Should().BeOfType<JsonResult>();
            _service.Verify(m => m.GetInterestHolders(It.IsAny<long>()), Times.Once());
        }

        [Fact]
        public void UpdateAcquisitionPropertyTakes_Success()
        {
            // Arrange
            _service.Setup(m => m.UpdateInterestHolders(It.IsAny<long>(), It.IsAny<List<PimsInterestHolder>>()));

            // Act
            var result = _controller.UpdateInterestHolderFile(1, new List<InterestHolderModel>());

            // Assert
            result.Should().BeOfType<JsonResult>();
            _service.Verify(m => m.UpdateInterestHolders(It.IsAny<long>(), It.IsAny<List<PimsInterestHolder>>()));
        }
    }
}
