using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDriverIdToAmbulance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DriverId",
                table: "Ambulances",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ambulances_DriverId",
                table: "Ambulances",
                column: "DriverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ambulances_AspNetUsers_DriverId",
                table: "Ambulances",
                column: "DriverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ambulances_AspNetUsers_DriverId",
                table: "Ambulances");

            migrationBuilder.DropIndex(
                name: "IX_Ambulances_DriverId",
                table: "Ambulances");

            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Ambulances");
        }
    }
}
